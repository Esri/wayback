import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';
import { batch } from 'react-redux';
import { IWaybackItem } from '../../types';
// import { IWaybackItem } from '../../types';

import { RootState, StoreDispatch, StoreGetState } from '../configureStore';

import {
    isSwipeWidgetOpenToggled,
} from './SwipeView';

export type AnimationModeState = {
    isAnimationModeOn: boolean;
    isDownloadGIFDialogOn: boolean;
    // rNum4AnimationFrames: number[],
    waybackItems4Animation: IWaybackItem[]
    // array of release numbers for items to be excluded from the animation
    rNum2Exclude: number[];
    // animation speed in second
    animationSpeed: number;
    isPlaying: boolean;
    indexOfCurrentFrame: number;
    isLoadingFrameData:boolean;
};

export const initialAnimationModeState = {
    isAnimationModeOn: false,
    isDownloadGIFDialogOn: false,
    // rNum4AnimationFrames: [],
    waybackItems4Animation: [],
    rNum2Exclude: [],
    animationSpeed: 1,
    isPlaying: true,
    indexOfCurrentFrame: 0,
    isLoadingFrameData: true
} as AnimationModeState;

const slice = createSlice({
    name: 'AnimationMode',
    initialState: initialAnimationModeState,
    reducers: {
        isAnimationModeOnToggled: (state: AnimationModeState) => {
            state.isAnimationModeOn = !state.isAnimationModeOn;
        },
        isDownloadGIFDialogOnToggled: (state: AnimationModeState) => {
            state.isDownloadGIFDialogOn = !state.isDownloadGIFDialogOn;
        },
        // rNum4AnimationFramesLoaded: (state:AnimationModeState, action:PayloadAction<number[]>)=>{
        //     state.rNum4AnimationFrames = action.payload
        // },
        waybackItems4AnimationLoaded: (state:AnimationModeState, action:PayloadAction<IWaybackItem[]>)=>{
            state.waybackItems4Animation = action.payload
        },
        rNum2ExcludeToggled: (state:AnimationModeState, action:PayloadAction<number>)=>{

            const rNum = action.payload;

            const idx = state.rNum2Exclude.indexOf(rNum);

            if(idx === -1){
                state.rNum2Exclude.push(rNum)
            } else {
                state.rNum2Exclude.splice(idx, 1);
            }
        },
        rNum2ExcludeReset: (state:AnimationModeState)=>{
            state.rNum2Exclude = []
        },
        animationSpeedChanged: (state:AnimationModeState, action:PayloadAction<number>)=>{
            state.animationSpeed = action.payload
        },
        isAnimationPlayingToggled: (state:AnimationModeState, action:PayloadAction<boolean>)=>{
            state.isPlaying = action.payload
        },
        indexOfCurrentFrameChanged: (state:AnimationModeState, action:PayloadAction<number>)=>{
            state.indexOfCurrentFrame = action.payload
        },
        isLoadingFrameDataToggled: (state:AnimationModeState, action:PayloadAction<boolean>)=>{
            state.isLoadingFrameData = action.payload;
        }

    },
});

const { reducer } = slice;

export const {
    isAnimationModeOnToggled,
    isDownloadGIFDialogOnToggled,
    waybackItems4AnimationLoaded,
    rNum2ExcludeToggled,
    rNum2ExcludeReset,
    animationSpeedChanged,
    isAnimationPlayingToggled,
    indexOfCurrentFrameChanged,
    isLoadingFrameDataToggled
} = slice.actions;

export const toggleIsLoadingFrameData = (isLoading:boolean)=>(dispatch: StoreDispatch, getState: StoreGetState)=>{

    const { AnimationMode } = getState();

    const { isPlaying } = AnimationMode;

    batch(()=>{
        dispatch(isLoadingFrameDataToggled(isLoading));

        if(isLoading){
            dispatch(indexOfCurrentFrameChanged(0));
        }
    
        if(!isLoading && isPlaying){
            dispatch(startAnimation())
        }
    })
}

export const toggleAnimationMode = ()=>(dispatch: StoreDispatch, getState: StoreGetState)=>{
    const { SwipeView } = getState();

    if(SwipeView.isSwipeWidgetOpen){
        dispatch(isSwipeWidgetOpenToggled());
    }

    dispatch(isAnimationModeOnToggled());
}

let interval4Animation: NodeJS.Timeout;

export const startAnimation = ()=>(dispatch: StoreDispatch, getState: StoreGetState)=>{
    const { AnimationMode } = getState();

    const { animationSpeed } = AnimationMode;

    dispatch(isAnimationPlayingToggled(true))

    clearInterval(interval4Animation);

    interval4Animation = setInterval(()=>{
        dispatch(showNextFrame())
    }, animationSpeed * 1000)
}

export const stopAnimation = ()=>(dispatch: StoreDispatch, getState: StoreGetState)=>{
    dispatch(isAnimationPlayingToggled(false))
    clearInterval(interval4Animation);
}

const showNextFrame = ()=>(dispatch: StoreDispatch, getState: StoreGetState)=>{

    const { AnimationMode } = getState();

    const { rNum2Exclude, waybackItems4Animation, indexOfCurrentFrame, isLoadingFrameData } = AnimationMode;

    if(isLoadingFrameData){
        return;
    }

    const rNum2ExcludeSet = new Set(rNum2Exclude);

    let idx4NextFrame = indexOfCurrentFrame;
    
    // loop through the circular array to find next item to show
    for(let i = indexOfCurrentFrame + 1; i < indexOfCurrentFrame + waybackItems4Animation.length; i++){
        const targetIdx = i % waybackItems4Animation.length;

        const targetItem = waybackItems4Animation[targetIdx];

        if(!rNum2ExcludeSet.has(targetItem.releaseNum)){
            idx4NextFrame = targetIdx;
            break;
        }
    }

    dispatch(indexOfCurrentFrameChanged(idx4NextFrame))
}

export const updateAnimationSpeed = (speedInSeconds:number)=>(dispatch: StoreDispatch, getState: StoreGetState)=>{
    const { AnimationMode } = getState();

    const { isPlaying, animationSpeed } = AnimationMode;

    if(speedInSeconds == animationSpeed){
        return;
    }

    batch(()=>{
        dispatch(animationSpeedChanged(speedInSeconds));
    
        if(isPlaying){
            dispatch(startAnimation())
        }
    })
}

export const toggleAnimationFrame = (releaseNum:number)=>(dispatch: StoreDispatch, getState: StoreGetState)=>{
    const { AnimationMode } = getState();

    const { isPlaying } = AnimationMode;

    batch(()=>{
        dispatch(rNum2ExcludeToggled(releaseNum));
    
        if(isPlaying){
            dispatch(startAnimation())
        }
    })

}

export const isAnimationModeOnSelector = createSelector(
    (state: RootState) => state.AnimationMode.isAnimationModeOn,
    (isAnimationModeOn) => isAnimationModeOn
);

export const isDownloadGIFDialogOnSelector = createSelector(
    (state: RootState) => state.AnimationMode.isDownloadGIFDialogOn,
    (isDownloadGIFDialogOn) => isDownloadGIFDialogOn
);

export const waybackItems4AnimationSelector = createSelector(
    (state: RootState) => state.AnimationMode.waybackItems4Animation,
    (waybackItems4Animation) => waybackItems4Animation
);

export const rNum2ExcludeSelector = createSelector(
    (state: RootState) => state.AnimationMode.rNum2Exclude,
    (rNum2Exclude) => rNum2Exclude
);

export const animationSpeedSelector = createSelector(
    (state: RootState) => state.AnimationMode.animationSpeed,
    (animationSpeed) => animationSpeed
);

export const isAnimationPlayingSelector = createSelector(
    (state: RootState) => state.AnimationMode.isPlaying,
    (isPlaying) => isPlaying
);

export const indexOfCurrentAnimationFrameSelector = createSelector(
    (state: RootState) => state.AnimationMode.indexOfCurrentFrame,
    (indexOfCurrentFrame) => indexOfCurrentFrame
);

export const waybackItem4CurrentAnimationFrameSelector = createSelector(
    (state: RootState) => state.AnimationMode.indexOfCurrentFrame,
    (state: RootState) => state.AnimationMode.waybackItems4Animation,
    (state: RootState) => state.AnimationMode.isLoadingFrameData,
    (indexOfCurrentFrame, waybackItems4Animation, isLoadingFrameData) => {

        if(!waybackItems4Animation.length || isLoadingFrameData){
            return null;
        }

        return  waybackItems4Animation[indexOfCurrentFrame]
    }
);

export default reducer;
