import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import MapView from '@arcgis/core/views/MapView';
import Extent from '@arcgis/core/geometry/Extent';
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import React, { useEffect } from 'react';
import Graphic from '@arcgis/core/Graphic';
import Polygon from '@arcgis/core/geometry/Polygon';
import { webMercatorToGeographic } from '@arcgis/core/geometry/support/webMercatorUtils';
import { EXPAND_EXTENT_FACTOR } from './constants';
import { IExtent } from '@typings/index';

type Props = {
    /**
     * Indicates whether the SketchViewModel should be active and allow editing on the map.
     */
    isActive: boolean;
    /**
     * The current extent to be displayed and edited.
     */
    extentToEdit: IExtent | null;
    /**
     * The MapView instance where the extent will be displayed and edited.
     */
    mapView: MapView;
    /**
     * Emits when the extent has been changed.
     * @param payload.extent - The updated extent resulting from the user's edits on the map.
     * @returns
     */
    onExtentChange: (extent: IExtent) => void;
};

/**
 * This hook initializes and manages a SketchViewModel for editing an extent on a MapView.
 * @param param.currentExtent - The current extent to be displayed and edited.
 * @param param.mapView - The MapView instance where the extent will be displayed and edited.
 * @param param.onExtentChange - Emits when the extent has been changed.
 * @returns void
 */
export const useSketchViewModel = ({
    isActive,
    extentToEdit,
    mapView,
    onExtentChange,
}: Props): void => {
    const sketchVMRef = React.useRef<SketchViewModel | null>(null);
    const graphicsLayerRef = React.useRef<__esri.GraphicsLayer | null>(null);

    /**
     * Indicates whether the SketchViewModel and its associated GraphicsLayer have been initialized and are ready for use.
     * This is used to ensure that we don't attempt to start editing or update the sketch before the SketchViewModel is fully set up.
     */
    const [isSketchVMReady, setIsSketchVMReady] = React.useState(false);

    const init = () => {
        if (!mapView) {
            console.error('MapView is required to initialize SketchViewModel');
            return;
        }

        if (!graphicsLayerRef.current) {
            graphicsLayerRef.current = new GraphicsLayer({
                listMode: 'hide',
                title: 'Sketch Graphics Layer',
            });

            mapView.map.add(graphicsLayerRef.current);
        }

        console.log('Initializing SketchViewModel');

        sketchVMRef.current = new SketchViewModel({
            view: mapView,
            layer: graphicsLayerRef.current,
            defaultUpdateOptions: {
                tool: 'transform', // move/scale/rotate
                enableRotation: false,
                enableScaling: true,
                preserveAspectRatio: false, // set true for uniform scaling
                toggleToolOnClick: false,
            },
        });

        // Listen for "update" events to react to edits
        sketchVMRef.current.on('update', function (event) {
            // event.state: "start" | "active" | "complete"
            // event.toolEventInfo?.type: e.g., "move", "move-stop", "reshape", "scale", "rotate", etc.
            const { state, graphics, toolEventInfo, type, aborted } = event;
            const g = graphics[0]; // we're only editing one

            if (state === 'start') {
                console.log('[update] start', { type, toolEventInfo });
                // sketchVMOnUpdate(g);
            }

            if (state === 'active') {
                if (
                    toolEventInfo.type === 'move-stop' ||
                    toolEventInfo.type === 'reshape-stop' ||
                    toolEventInfo.type === 'scale-stop'
                ) {
                    // const updatedGeometry = g.geometry as Polygon;
                    // console.log('Updated geometry:', updatedGeometry);
                    // onExtentChange(updatedGeometry.extent);

                    sketchVMOnUpdate(g);
                }
            }

            if (state === 'complete') {
                if (aborted) {
                    // console.log("[update] aborted");
                    return;
                }
                sketchVMOnUpdate(g);
            }
        });

        setIsSketchVMReady(true);
    };

    const sketchVMOnUpdate = (graphic: Graphic) => {
        if (!graphic) {
            return;
        }

        const updatedGeometry = graphic.geometry as Polygon;
        // console.log('Updated geometry:', updatedGeometry);

        const extent: Extent = updatedGeometry.extent;
        // console.log('Updated extent from sketchVM:', extent);

        if (!extent) {
            return;
        }

        const extentInWGS84 = webMercatorToGeographic(extent);

        onExtentChange(extentInWGS84.toJSON() as IExtent);
    };

    /**
     * Start editing the provided extent on the map using the SketchViewModel.
     * @param extent - The extent to be edited.
     * @returns void
     */
    const startEditing = async (extentToEdit: Extent) => {
        if (!sketchVMRef.current || !graphicsLayerRef.current) {
            return;
        }

        graphicsLayerRef.current.removeAll();

        if (!extentToEdit) {
            console.warn('No extent provided for editing');
            return;
        }

        try {
            const extentGraphic = new Graphic({
                geometry: extentToEdit,
                symbol: {
                    type: 'simple-fill',
                    color: [0, 0, 0, 0.2],
                    style: 'solid',
                    outline: {
                        color: [0, 0, 0, 0.5],
                        width: 2,
                    },
                },
            });

            graphicsLayerRef.current.add(extentGraphic);

            await sketchVMRef.current.update(extentGraphic);
            // sketchVMRef.current.activate("update");

            // await mapView.goTo(
            //     extentToEdit.clone().expand(EXPAND_EXTENT_FACTOR)
            // );
        } catch (error) {
            console.error('Error starting sketch edit:', error);
        }
    };

    useEffect(() => {
        // only initialize the SketchViewModel if we have a mapView and if the hook is active (e.g. we're in wayport mode and have an extent to edit)
        if (!mapView || !isActive) {
            return;
        }

        init();
    }, [mapView, isActive]);

    useEffect(() => {
        return () => {
            if (sketchVMRef.current) {
                sketchVMRef.current.destroy();
                sketchVMRef.current = null;
                console.log('SketchViewModel destroyed', sketchVMRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (
            !sketchVMRef.current ||
            !graphicsLayerRef.current ||
            !isSketchVMReady
        ) {
            // console.log('No sketchVM or graphicsLayer available');
            return;
        }

        if (!extentToEdit) {
            sketchVMRef.current.cancel();
            graphicsLayerRef.current.removeAll();
            // console.log('No extent to edit, clearing sketch and graphics layer');
            return;
        }

        // check if there's an existing graphic on the layer to update, if not, create a new one to edit
        const existingGraphic = graphicsLayerRef.current.graphics.getItemAt(0);

        if (!existingGraphic) {
            const extent = new Extent({
                xmin: extentToEdit.xmin,
                ymin: extentToEdit.ymin,
                xmax: extentToEdit.xmax,
                ymax: extentToEdit.ymax,
                spatialReference: extentToEdit.spatialReference,
            });

            // console.log('Starting new sketch edit with extent:', extentToEdit);

            // console.log('No existing graphic to update');
            startEditing(extent);
            return;
        }
    }, [extentToEdit, isSketchVMReady]); // re-run when the extent to edit changes or when the sketchVM is ready

    return null;
};
