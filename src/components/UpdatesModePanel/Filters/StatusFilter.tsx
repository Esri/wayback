import React, { FC } from 'react';
import { HeaderText } from './HeaderText';
import { useTranslation } from 'react-i18next';

type StatusCheckboxProps = {
    /**
     * The checked state of the checkbox
     */
    checked: boolean;
    /**
     * Status of the data associated with the checkbox.
     */
    status: 'pending' | 'published';
    /**
     * The number of sites associated with the checkbox.
     */
    count: number;
    /**
     * The area associated with the checkbox.
     */
    area: number; // in km2
    /**
     * The color associated with the checkbox.
     */
    color: string;
    /**
     * Emits when the checkbox state changes.
     * @returns void
     */
    onChange?: () => void;
};

const StatusCheckbox: FC<StatusCheckboxProps> = ({
    checked,
    status,
    count,
    area,
    color,
    onChange,
}) => {
    const { t } = useTranslation();

    return (
        <div
            className="grid items-center text-xs"
            style={{
                gridTemplateColumns: '24px 1fr',
            }}
        >
            <calcite-checkbox
                checked={checked ? true : undefined}
                onClick={onChange}
            ></calcite-checkbox>
            <div
                className="grid items-center gap-1"
                style={{
                    color: color ? color : 'inherit',
                    gridTemplateColumns: '62px 1fr',
                }}
            >
                <span className="text-sm">{t(status)}</span>
                <div>
                    <span className="ml-1 mr-2">|</span>
                    <span className="text-sm">
                        {t('status_message', {
                            num_sites: count,
                            area,
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
};

export const StatusFilter = () => {
    const { t } = useTranslation();
    return (
        <div className="bg-custom-card-background p-2 mb-2 text-white">
            <HeaderText title={t('status')} />

            <StatusCheckbox
                checked={true}
                status="pending"
                count={5}
                area={100}
                color="var(--updates-status-pending-color)"
                onChange={() => console.log('Pending status changed')}
            />
            <StatusCheckbox
                checked={true}
                status="published"
                count={3}
                area={50}
                color="var(--updates-status-published-color)"
                onChange={() => console.log('Updated status changed')}
            />
        </div>
    );
};
