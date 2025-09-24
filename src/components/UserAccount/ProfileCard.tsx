import { CalciteButton, CalciteIcon } from '@esri/calcite-components-react';
import useOnClickOutside from '@hooks/useOnClickOutside';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { UserData } from './UserAccount';

// Props for the AccountAvatar component
type Props = {
    /**
     * User data including thumbnail URL, full name, username, and organization name
     */
    userData: UserData;
    /**
     * Emits when the user clicks the sign-out button.
     * @returns Function to handle sign-out action (if applicable)
     */
    signOutOnClick: () => void;
    /**
     * Emits when the user clicks the avatar to toggle the profile card visibility.
     * @returns Function to toggle the profile card visibility
     */
    toggleOpenProfileCard: () => void;
};

export const ProfileCard: FC<Props> = ({
    userData,
    signOutOnClick,
    toggleOpenProfileCard,
}) => {
    const { t } = useTranslation();

    const { userName, orgName } = userData || {};

    const containerRef = React.useRef<HTMLDivElement>(null);

    useOnClickOutside(containerRef, () => {
        toggleOpenProfileCard();
    });

    return (
        <div
            ref={containerRef}
            className="absolute left-[115%] bottom-0 w-64 background-theme-blue-diagonal-pattern text-white shadow-lg rounded-md p-4 z-20"
        >
            <p className="text-sm " title={userName}>
                <CalciteIcon icon="user" scale="s" className="mr-1" />
                <span>{t('signed_in_as', { user: userName })}</span>
            </p>
            {orgName && (
                <p className="text-sm mb-2 " title={orgName}>
                    <CalciteIcon
                        icon="organization"
                        scale="s"
                        className="mr-1"
                    />
                    <span>{orgName}</span>
                </p>
            )}
            <CalciteButton
                appearance="outline"
                kind="inverse"
                iconStart="sign-out"
                scale="s"
                onClick={() => {
                    signOutOnClick();
                }}
                label={t('sign_out')}
            >
                <span className="underline">{t('sign_out')}</span>
            </CalciteButton>

            <div
                className="absolute top-1 right-1 cursor-pointer"
                style={{
                    '--calcite-color-text-inverse': 'var(--default-text-color)',
                }}
            >
                <CalciteButton
                    appearance="transparent"
                    kind="inverse"
                    iconStart="x"
                    scale="s"
                    onClick={() => {
                        toggleOpenProfileCard();
                    }}
                    label={t('close')}
                ></CalciteButton>
            </div>
        </div>
    );
};
