/* Page: Profile - Displays the user's profile, inbox, and settings */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'; // Need to implement Tabs
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Trash2, Heart, Globe, Inbox, LogOut } from 'lucide-react';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [activeTab, setActiveTab] = useState("inbox");
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }

    useEffect(() => {
        fetchProfile();
        fetchMessages();
    }, [activeTab]); // Refetch messages when tab changes (simple approach)

    const fetchProfile = async () => {
        try {
            const res = await axios.get('http://localhost:8000/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchMessages = async () => {
        // Determine status based on tab
        let statusFilter = "inbox";
        if (activeTab === "public") statusFilter = "public";
        if (activeTab === "favorite") statusFilter = "favorite";
        if (activeTab === "info") return;

        try {
            const res = await axios.get(`http://localhost:8000/messages/?status=${statusFilter}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
        } catch (err) { console.error(err); }
    };

    const moveMessage = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:8000/messages/${id}/status?new_status=${newStatus}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMessages(); // Refresh
        } catch (err) { console.error(err); }
    };

    const deleteMessage = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/messages/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMessages();
        } catch (err) { console.error(err); }
    };

    if (!user) return <div className="p-4">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b">
                <h1 className="text-xl font-bold tracking-tight text-gray-900">My Profile</h1>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                    title="Log out"
                >
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>

            {/* Profile Info Section */}
            <div className="flex flex-col items-center pt-8 pb-6 px-4 bg-white">
                <Avatar className="h-28 w-28 border-4 border-white shadow-xl ring-1 ring-gray-100 mb-4">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-blue-600 text-white">
                        {user.username[0].toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold text-gray-900">{user.name || user.username}</h2>
                <p className="text-gray-500 font-medium">@{user.username}</p>
                {user.bio && <p className="mt-2 text-sm text-gray-600 max-w-xs text-center">{user.bio}</p>}

                <div className="mt-4 space-y-1 text-center">
                    {user.email && <p className="text-sm text-gray-500">{user.email}</p>}
                    {user.phone_number && <p className="text-sm text-gray-500">{user.phone_number}</p>}
                </div>
            </div>

            {/* Tabs Section using simple state buttons for cleaner control than the missing Radix Tabs */}
            <div className="px-4 mt-4">
                <div className="grid grid-cols-3 p-1 bg-gray-100 rounded-xl">
                    <button
                        onClick={() => setActiveTab("inbox")}
                        className={`flex items-center justify-center py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === "inbox"
                            ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <Inbox className="w-4 h-4 mr-2" /> Inbox
                    </button>
                    <button
                        onClick={() => setActiveTab("public")}
                        className={`flex items-center justify-center py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === "public"
                            ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <Globe className="w-4 h-4 mr-2" /> Public
                    </button>
                    <button
                        onClick={() => setActiveTab("favorite")}
                        className={`flex items-center justify-center py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === "favorite"
                            ? "bg-white text-pink-500 shadow-sm ring-1 ring-black/5"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <Heart className="w-4 h-4 mr-2" /> Liked
                    </button>
                </div>
            </div>

            {/* Messages Content */}
            <div className="px-4 mt-6 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                            {activeTab === 'inbox' && <Inbox className="h-6 w-6 text-gray-400" />}
                            {activeTab === 'public' && <Globe className="h-6 w-6 text-gray-400" />}
                            {activeTab === 'favorite' && <Heart className="h-6 w-6 text-gray-400" />}
                        </div>
                        <p className="text-gray-500 font-medium">No messages in {activeTab}</p>
                    </div>
                )}

                {messages.map(msg => (
                    <Card key={msg.id} className="border-0 shadow-sm ring-1 ring-gray-100 overflow-hidden">
                        <CardContent className="p-5">
                            <p className="text-lg text-gray-800 leading-relaxed font-medium">"{msg.content}"</p>

                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                                <span className="text-xs font-medium text-gray-400">
                                    {new Date(msg.created_at).toLocaleString()}
                                </span>
                                <div className="flex gap-1">
                                    {activeTab !== "public" && (
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => moveMessage(msg.id, "public")}>
                                            <Globe className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {activeTab !== "favorite" && (
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-pink-600 hover:bg-pink-50" onClick={() => moveMessage(msg.id, "favorite")}>
                                            <Heart className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50" onClick={() => deleteMessage(msg.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
