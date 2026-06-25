export function Card({

    children,

    className = "",

    title,

    subtitle,

    actions,

    footer,

    variant = "default"

}) {

    return (

        <section
            className={`card card-${variant} ${className}`}
        >

            {(title || subtitle || actions) && (

                <header className="cardHeader">

                    <div>

                        {subtitle && (

                            <span className="cardSubtitle">

                                {subtitle}

                            </span>

                        )}

                        {title && (

                            <h3 className="cardTitle">

                                {title}

                            </h3>

                        )}

                    </div>

                    {actions && (

                        <div className="cardActions">

                            {actions}

                        </div>

                    )}

                </header>

            )}

            <div className="cardBody">

                {children}

            </div>

            {footer && (

                <footer className="cardFooter">

                    {footer}

                </footer>

            )}

        </section>

    );

}