import { FooterLogo } from "./FooterLogo"


export const Footer = () =>{

    return(
        <footer className="flex bottom-0 left-0 h-[264px] text-white bg-black w-screen items-center  p-4">
            <div className="flex flex-col justify-start ">
                <div>
                    <FooterLogo />
                </div>
                <div>
                    <p>© 2021 All Rights Reserved</p>
                </div>
            </div>
            <div className=" w-[187px] h-[168px] ml-[550px] font-sans text-[16px] leading-[24px] top-[48px] flex flex-col gap-y-[24px]">
                <div>
                    Home
                </div>
                <div>
                    About Ghana
                </div>
                <div>
                    Destinations
                </div>
                <div>
                    Plan Your Trip
                </div>
            </div>

        </footer>
    )
}