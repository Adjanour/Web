import { Logo } from "./Logo"
import { SearchBox } from "./SearchBox"

export const Navbar = () => {

    return (
        <nav className="flex w-screen h-[120px] text-sm justify-between items-center p-4">
            <div className="">
                <Logo />
            </div>
            <div className="flex flex-row align-middle items-center w-fit h-fit gap-4">
                <div className="flex flex-row h-[19px] w-[476px] gap-2 gap-x-2 font-sans text-[16px]">
                    <p>About Ghana</p>
                    <p>Destinations</p>
                    <p>Experiences</p>
                    <p>Hotels</p>
                </div>
                <div>
                    <SearchBox />
                </div>
            </div>
        </nav>
    )
}