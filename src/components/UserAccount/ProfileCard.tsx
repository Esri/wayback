import { CalciteButton, CalciteIcon } from '@esri/calcite-components-react';
import useOnClickOutside from '@hooks/useOnClickOutside';
import React, { FC, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { UserData } from './useUserData';

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
    closeProfileCard: () => void;
};

export const ProfileCard: FC<Props> = ({
    userData,
    signOutOnClick,
    closeProfileCard,
}) => {
    const { t } = useTranslation();

    const { userName, userFullName, orgName, profileSettingsPageURL } =
        userData || {};

    const containerRef = React.useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLCalciteButtonElement>(null);

    useOnClickOutside(containerRef, () => {
        closeProfileCard();
    });

    useEffect(() => {
        if (closeButtonRef.current) {
            closeButtonRef.current.setFocus();
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-64 background-theme-blue-diagonal-pattern text-white shadow-lg rounded-md p-4"
        >
            <div
                className="absolute top-1 right-1 cursor-pointer"
                style={{
                    '--calcite-color-text-inverse': 'var(--default-text-color)',
                }}
            >
                <CalciteButton
                    ref={closeButtonRef}
                    appearance="transparent"
                    kind="inverse"
                    iconStart="x"
                    scale="s"
                    onClick={() => {
                        closeProfileCard();
                    }}
                    label={t('close')}
                ></CalciteButton>
            </div>

            <div className="flex mb-4">
                {/* <div className='shrink-0'>
                    <CalciteIcon icon="user" scale="s" className="mr-1" />
                </div> */}

                <div className="ml-1 break-words">
                    <div className="flex items-center text-sm font-medium ">
                        <a
                            href={profileSettingsPageURL}
                            target="_blank"
                            className="underline text-white"
                            rel="noreferrer"
                        >
                            {userFullName || userName}
                        </a>
                    </div>

                    <p className="text-xs mb-1">
                        {orgName
                            ? t('user_of_org', {
                                  orgName: orgName,
                                  username: userName,
                              })
                            : t('user_of_public_account', {
                                  username: userName,
                              })}
                    </p>
                </div>
            </div>

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
                <span>{t('sign_out')}</span>
            </CalciteButton>
        </div>
    );
};
