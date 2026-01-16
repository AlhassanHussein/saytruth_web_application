/* Page: Search - Allows users to search for other users */
import { useState } from 'react';
import axios from 'axios';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Search as SearchIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Search() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/users/search?q=${query}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResults(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Discover</h1>
            <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                    placeholder="Search username..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button type="submit" size="icon">
                    <SearchIcon className="h-4 w-4" />
                </Button>
            </form>

            <div className="space-y-2 mt-4">
                {results.map((user) => (
                    <Card key={user.id}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <Link to={`/public/${user.username}`} className="flex items-center gap-3 flex-1">
                                <Avatar>
                                    <AvatarImage src={user.avatar_url} />
                                    <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{user.username}</p>
                                    <p className="text-xs text-gray-500">{user.name}</p>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
                {results.length === 0 && !loading && <div className="text-center text-gray-400 mt-8">Search for finding new friends</div>}
            </div>
        </div>
    );
}
