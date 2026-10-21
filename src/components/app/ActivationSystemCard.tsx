import { Link } from 'react-router-dom'
import { ArrowLeft, Gamepad2, Coffee, Smartphone, KeyRound } from 'lucide-react'

import { Card } from '@/components/ui/card'
import type { ActivationSystem } from '@/config/activationSystems'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    'ps-manager': Gamepad2,
    'ps-cafe-manager': Coffee,
    'mobile-manager': Smartphone,
}



const ActivationSystemCard = ({ system }: { system: ActivationSystem }) => {
    const Icon = ICONS[system.id] ?? KeyRound
    return (
        <Link to={`/activation/${system.id}`}>
            <Card className="group flex h-full flex-col gap-4 p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-2 hover:ring-primary/30">
                <div className="flex items-center justify-between">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-6" />
                    </div>
                    <ArrowLeft className="size-4 rotate-180 text-muted-foreground transition-transform group-hover:-translate-x-1" />
                </div>

                <div>
                    <h2 className="text-lg font-bold text-foreground">{system.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{system.description}</p>
                </div>

                <div className="mt-auto flex items-center gap-1.5 border-t border-border pt-3 text-sm font-medium text-primary">
                    <KeyRound className="size-4" />
                    توليد كود التفعيل
                </div>
            </Card>
        </Link>
    );
};

export default ActivationSystemCard;