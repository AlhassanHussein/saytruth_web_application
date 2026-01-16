/* Page: Home - Shows the list of favorite friends (dashboard) */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { MessageSquare, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
    const [favorites, setFavorites] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const response = await axios.get('http://localhost:8000/users/favorites/list', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(response.data);
        } catch (error) {
            console.error("Error fetching favorites", error);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Friends Hub</h1>

            {favorites.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                    <p>No favorites yet.</p>
                    <Button variant="link" asChild>
                        <Link to="/search">Find friends</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {favorites.map((user) => (
                        <Card
                            key={user.id}
                            className="overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => navigate(`/public/${user.username}`)}
                        >
                            <CardContent className="p-4 flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={user.avatar_url} />
                                    <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className="font-semibold">{user.name || user.username}</h3>
                                    <p className="text-sm text-gray-500">@{user.username}</p>
                                </div>
                                <div className="flex gap-2">
                                    {/* Action: View Public Board */}
                                    <Button size="icon" variant="ghost">
                                        <MessageSquare className="h-5 w-5" />
                                    </Button>
                                    {/* Action: Send Message (Modal trigger in future) */}
                                    {/* For MVP, let's link to public board to send from there? Or separate Send page? */}
                                    {/* Spec says "Action: Send one anonymous message". Let's do a simple prompt or navigate to message page */}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
