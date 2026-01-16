/* Page: Signup - Allows new users to create an account */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2 } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Signup() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError(t('signup.errorMismatch'));
            return;
        }
        setLoading(true);
        setError("");

        try {
            await axios.post('http://localhost:8000/auth/signup', {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                phone_number: formData.phone
            });

            // Auto login or redirect to login? Let's redirect to login for now
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || t('signup.errorFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4 relative">
            <div className="absolute top-4 right-4">
                <LanguageSwitcher />
            </div>
            <Card className="w-full max-w-md bg-white border-0 shadow-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-primary">{t('signup.title')}</CardTitle>
                    <CardDescription className="text-center">
                        {t('signup.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="username">{t('signup.usernameLabel')}</label>
                            <Input
                                id="username"
                                placeholder={t('signup.usernamePlaceholder')}
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="password">{t('signup.passwordLabel')}</label>
                            <Input
                                id="password"
                                type="password"
                                placeholder={t('signup.passwordPlaceholder')}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="confirmPassword">{t('signup.confirmPasswordLabel')}</label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder={t('signup.confirmPasswordPlaceholder')}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="email">{t('signup.emailLabel')}</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={t('signup.emailPlaceholder')}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="phone">{t('signup.phoneLabel')}</label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder={t('signup.phonePlaceholder')}
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        {error && <div className="text-sm text-destructive text-center">{error}</div>}
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {t('signup.submitButton')}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-center text-gray-500">
                        {t('signup.hasAccount')}{" "}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            {t('signup.loginLink')}
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
