import { useEffect, useState } from "react";

interface CountdownProps {
    targetDate: Date;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function Countdown({ targetDate }: CountdownProps) {
    const calculateTimeLeft = (): TimeLeft | null => {
        const difference = +targetDate - +new Date();
        
        if (difference <= 0) {
            return null;
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    };

    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) {
        return null;
    }

    return (
        <div className="flex flex-row gap-2 tablet:gap-4 text-accent-foreground items-center justify-center">
            <div className="flex flex-col items-center">
                <span className="text-2xl tablet:text-4xl font-bold font-width-wide tabular-nums">
                    {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-xs tablet:text-sm text-muted-foreground uppercase tracking-wider">
                    days
                </span>
            </div>
            <span className="text-2xl tablet:text-4xl font-bold">:</span>
            <div className="flex flex-col items-center">
                <span className="text-2xl tablet:text-4xl font-bold font-width-wide tabular-nums">
                    {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-xs tablet:text-sm text-muted-foreground uppercase tracking-wider">
                    hours
                </span>
            </div>
            <span className="text-2xl tablet:text-4xl font-bold">:</span>
            <div className="flex flex-col items-center">
                <span className="text-2xl tablet:text-4xl font-bold font-width-wide tabular-nums">
                    {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-xs tablet:text-sm text-muted-foreground uppercase tracking-wider">
                    mins
                </span>
            </div>
            <span className="text-2xl tablet:text-4xl font-bold">:</span>
            <div className="flex flex-col items-center">
                <span className="text-2xl tablet:text-4xl font-bold font-width-wide tabular-nums">
                    {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-xs tablet:text-sm text-muted-foreground uppercase tracking-wider">
                    secs
                </span>
            </div>
        </div>
    );
}
