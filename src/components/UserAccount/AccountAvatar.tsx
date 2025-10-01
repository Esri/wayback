import { CalciteIcon } from '@esri/calcite-components-react';
import classNames from 'classnames';
import React, { FC } from 'react';
import { UserData } from './useUserData';
import { useTranslation } from 'react-i18next';

// Props for the AccountAvatar component
type Props = {
    /**
     * User data including thumbnail URL, full name, username, and organization name
     */
    userData: UserData;
    /**
     * Emits when the user clicks the sign-in button.
     * @returns Function to handle sign-in action (if applicable)
     */
    signInOnClick: () => void;
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

export const AccountAvatar: FC<Props> = ({
    userData,
    signInOnClick,
    signOutOnClick,
    toggleOpenProfileCard,
}) => {
    const { t } = useTranslation();

    const buttonRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
        if (buttonRef.current) {
            buttonRef.current.focus();
        }
    }, []);

    const {
        thumbnailUrl,
        userFullName,
        userName,
        // orgName
    } = userData || {};

    const label = userName
        ? t('signed_in_as', { user: userName })
        : t('sign_in');

    const getContent = () => {
        if (thumbnailUrl) {
            return (
                <img
                    src={thumbnailUrl}
                    alt="user avatar"
                    className="w-full h-full object-cover rounded-full"
                />
            );
        }

        if (userFullName && typeof userFullName === 'string') {
            const initials = userFullName
                .trim()
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
            return <span className="text-white font-medium">{initials}</span>;
        }

        if (userName && typeof userName === 'string') {
            const initials = userName.slice(0, 1).toUpperCase();
            return <span className="text-white font-medium">{initials}</span>;
        }

        return <CalciteIcon icon="user" scale="m" />;
    };
    return (
        <div
            className="relative flex justify-center items-center w-full my-2 cursor-pointer px-1"
            title={label}
        >
            <button
                ref={buttonRef}
                className={classNames(
                    'relative w-full flex justify-center items-center text-center '
                    // {
                    //     border: !thumbnailUrl,
                    // }
                )}
                aria-label={label}
                onClick={() => {
                    if (!userName) {
                        signInOnClick();
                    } else {
                        toggleOpenProfileCard();
                    }
                }}
            >
                <div
                    className={classNames(
                        'w-9 h-9 flex justify-center items-center  border-white border-opacity-90 rounded-full',
                        {
                            border: !thumbnailUrl,
                        }
                    )}
                >
                    {getContent()}
                </div>
            </button>
        </div>
    );
};
