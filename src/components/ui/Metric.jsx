export function Metric({

    label,

    value,

    tone = "neutral",

    helper,

    icon,

    trend,

    onClick

}) {

    return (

        <article
            className={`metric ${tone} ${onClick ? "clickable" : ""}`}
            onClick={onClick}
        >

            {icon && (

                <div className="metricIcon">

                    {icon}

                </div>

            )}

            <div className="metricContent">

                <span className="metricLabel">

                    {label}

                </span>

                <strong className="metricValue">

                    {value}

                </strong>

                {helper && (

                    <small className="metricHelper">

                        {helper}

                    </small>

                )}

            </div>

            {trend && (

                <div className="metricTrend">

                    {trend}

                </div>

            )}

        </article>

    );

}