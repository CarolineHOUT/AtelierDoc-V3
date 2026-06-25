export function Button({

    children,

    variant = "secondary",

    size = "md",

    className = "",

    icon,

    iconRight,

    loading = false,

    fullWidth = false,

    ...props

}) {

    return (

        <button

            className={`btn ${variant} ${size} ${fullWidth ? "full" : ""} ${loading ? "loading" : ""} ${className}`}

            disabled={loading || props.disabled}

            {...props}

        >

            {loading && (

                <span className="btnLoader" />

            )}

            {!loading && icon && (

                <span className="btnIcon">

                    {icon}

                </span>

            )}

            <span className="btnLabel">

                {children}

            </span>

            {!loading && iconRight && (

                <span className="btnIcon">

                    {iconRight}

                </span>

            )}

        </button>

    );

}