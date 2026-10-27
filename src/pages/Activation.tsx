import { ArrowLeft, History, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { activationSystems } from '@/config/activationSystems';
import { Button } from '@/components/ui/button';
import ActivationSystemCard from '@/components/app/ActivationSystemCard';

const Activation = () => {
    return (
        <div dir="rtl" className="min-h-dvh bg-background">
            <header className="border-b border-border bg-card">
                <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-5 sm:px-6">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <KeyRound className="size-5" />
                    </div>

                    <div className="flex-1">
                        <h1 className="text-lg font-bold text-foreground">أكواد التفعيل</h1>
                        <p className="text-sm text-muted-foreground">اختار النظام المطلوب لتوليد كود التفعيل</p>
                    </div>

                    <Button variant="outline" size="sm" className="gap-2" asChild>
                        <Link to="/activation/log">
                            <History className="size-4" />
                            سجل الأكواد
                        </Link>
                    </Button>

                    <Button variant="ghost" size="sm" className="gap-2" asChild>
                        <Link to="/">
                            الرئيسية
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-foreground">أنظمة RO'YA</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        اختار النظام، وبعدها أدخل بيانات الجهاز وحدد مدة التفعيل.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {activationSystems.map((system) => (
                        <ActivationSystemCard key={system.id} system={system} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Activation;