import type { JSX } from "react";




export interface IFloatingMenuItem {
    icon : JSX.Element
    name: string
    onClick?: () => void

}
export default function FloatingMenu({ menuItems, side }: { menuItems: IFloatingMenuItem[], side: 'right' | 'left' }) {


    return (
        <>
            <div className={`floating-menu ${side}`}>
                {menuItems.map(m => {
                    return <div key={m.name} className="floating-menu-item" onClick={() => {
                        m?.onClick?.();
                    }}>
                        {m.icon}
                    </div>
                })}
            </div>
        </>
    );
}
