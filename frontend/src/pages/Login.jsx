/* Page: Login - Allows users to sign in to their account */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Login() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const form = new FormData();
            form.append('username', formData.username);
            form.append('password', formData.password);

            const response = await axios.post('http://localhost:8000/auth/token', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            localStorage.setItem('token', response.data.access_token);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(t('login.errorInvalid'));
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
                    <CardTitle className="text-2xl font-bold text-center text-primary">{t('login.title')}</CardTitle>
                    <CardDescription className="text-center">
                        {t('login.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="username">
                                {t('login.usernameLabel')}
                            </label>
                            <Input
                                id="username"
                                placeholder={t('login.usernamePlaceholder')}
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                                {t('login.passwordLabel')}
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t('login.passwordPlaceholder')}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        {error && <div className="text-sm text-destructive text-center">{error}</div>}
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {t('login.submitButton')}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-center text-gray-500">
                        {t('login.noAccount')}{" "}
                        <Link to="/signup" className="text-primary hover:underline font-medium">
                            {t('login.signupLink')}
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
