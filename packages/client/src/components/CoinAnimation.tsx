import { FC, useEffect, useState } from 'react';

interface CoinChange {
    id: string;
    amount: number;
    timestamp: number;
}

interface CoinAnimationProps {
    playerId: string;
    currentCoins: number;
}

const coinChangeStore: Map<string, CoinChange[]> = new Map();
const previousCoins: Map<string, number> = new Map();

export const trackCoinChange = (playerId: string, newCoins: number) => {
    const prevCoins = previousCoins.get(playerId);
    if (prevCoins !== undefined && prevCoins !== newCoins) {
        const change = newCoins - prevCoins;
        const changes = coinChangeStore.get(playerId) || [];
        changes.push({ id: `${Date.now()}-${Math.random()}`, amount: change, timestamp: Date.now() });
        coinChangeStore.set(playerId, changes.slice(-5));
    }
    previousCoins.set(playerId, newCoins);
};

export const CoinAnimation: FC<CoinAnimationProps> = ({ playerId, currentCoins }) => {
    const [changes, setChanges] = useState<CoinChange[]>([]);

    useEffect(() => {
        trackCoinChange(playerId, currentCoins);
        const stored = coinChangeStore.get(playerId) || [];
        const recent = stored.filter((c) => Date.now() - c.timestamp < 2000);
        setChanges(recent);

        const interval = setInterval(() => {
            const stored = coinChangeStore.get(playerId) || [];
            const recent = stored.filter((c) => Date.now() - c.timestamp < 2000);
            setChanges(recent);
            coinChangeStore.set(playerId, recent);
        }, 100);

        return () => clearInterval(interval);
    }, [playerId, currentCoins]);

    return (
        <div className="relative">
            {changes.map((change) => (
                <div
                    key={change.id}
                    className={`
                        absolute -top-6 left-1/2 -translate-x-1/2 font-mono font-bold text-sm
                        animate-coin-float pointer-events-none whitespace-nowrap
                        ${change.amount > 0 ? 'text-emerald-400' : 'text-red-400'}
                    `}
                >
                    {change.amount > 0 ? '+' : ''}{change.amount}
                </div>
            ))}
        </div>
    );
};

export const CoinDisplay: FC<{ coins: number; playerId: string; size?: 'sm' | 'md' | 'lg' }> = ({
    coins,
    playerId,
    size = 'md'
}) => {
    const sizeClasses = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-3 py-1.5',
        lg: 'px-4 py-2 text-lg',
    };

    const iconSizes = {
        sm: 'w-4 h-4 text-[10px]',
        md: 'w-5 h-5 text-xs',
        lg: 'w-6 h-6 text-sm',
    };

    return (
        <div className={`coin-display relative ${sizeClasses[size]}`}>
            <CoinAnimation playerId={playerId} currentCoins={coins} />
            <div className={`coin-icon ${iconSizes[size]}`}>$</div>
            <span className={`font-mono font-medium text-amber-400 ${size === 'lg' ? 'text-xl' : ''}`}>
                {coins}
            </span>
        </div>
    );
};
