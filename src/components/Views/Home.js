import './Home.scss'
import amduongLogo from '../../assets/images/amduongLogo.png'

const Home = () => {

    return (
        <>
            <div className='home-container'>
                <div className='title1 d-xl-block d-none'>PHÒNG KHÁM ĐÔNG Y</div>
                <div className='title-mobi d-xl-none d-block'>PHÒNG KHÁM ĐÔNG Y</div>
                <div className='logo'>
                    <img
                        src={amduongLogo} width="300" height="300"
                        className="d-inline-block align-top"
                    />
                </div>
                <div className='title2'>
                    <div className='sub-title1'>LƯƠNG Y ĐA KHOA</div>
                    <div className='sub-title2'>
                        <div className="glitch-wrapper">
                            <div className="glitch" data-glitch="Đoàn Văn Thanh">Đoàn Văn Thanh</div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Home