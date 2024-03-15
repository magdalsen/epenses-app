import style from './ConfirmPage.module.css';
import { Link } from 'react-router-dom';
import { ConfirmButton } from './common/Buttons';
import { buttonData } from './constans/constans';

export const ConfirmPage = () => {
    return (
        <>
            <div className={style.confirmBox}>
                Thank you for registration. Confirm via email and login.
            </div>
            <div>
                <Link to={'/'}>
                    <ConfirmButton value={buttonData.backButton} />
                </Link>
            </div>
        </>
    )
}
