    import React from 'react'
    import './AppDownload.css'
    import { assets } from '../../assets/assets'

    const AppDownload = () => {
    return (
        <div>
        <div className="app-download" id='app-download'>
            <p>Tải ứng dụng để có trải nghiệm tốt hơn <br /> Food HVT App</p>
            <div className="app-download-platforms">
                <img src={assets.gg_play} alt="gg_play" />
                <img src={assets.app_store} alt="app_store" />
            </div>
        </div>
        </div>
    )
    }

    export default AppDownload
