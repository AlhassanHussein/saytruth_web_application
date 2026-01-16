/* Page: Public Profile - Displays a user's public profile and allows sending anonymous messages */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Send, Loader2, UserPlus, UserCheck } from 'lucide-react';

// Simple textarea component since we didn't create it yet
const SimpleTextarea = ({ value, onChange, placeholder, className }) => (
    <textarea
        className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
    />
);

export default function PublicProfile() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [publicMessages, setPublicMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [checkingFriend, setCheckingFriend] = useState(true);
    const token = localStorage.getItem('token');

    // We don't strictly require a token to view a public profile in many apps,
    // but our backend API uses `get_current_user` effectively?
    // Actually, `read_public_profile` in backend/routes/users.py DOES NOT require login.
    // `get_public_messages` also does not.
    // BUT `send_message` might? Let's check backend/routes/messages.py -> `send_message` depends on `get_session` but NOT `get_current_user`.
    // Wait, if it's truly anonymous, we shouldn't need a token to send.
    // The previous implementation plan said "1 Anonymous message limit logic check...".

    useEffect(() => {
        fetchUser();
        fetchPublicMessages();
    }, [username]);

    const fetchUser = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/users/${username}`);
            setUser(res.data);
            checkIfFriend(res.data.id);
        } catch (err) {
            console.error("User not found");
        }
    };

    const checkIfFriend = async (profileId) => {
        if (!token) {
            setCheckingFriend(false);
            return;
        }
        try {
            const res = await axios.get('http://localhost:8000/users/favorites/list', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const favorites = res.data;
            // Assuming list returns user objects or we check ID
            // backend/routes/users.py: `response_model=List[UserPublic]` for `/favorites/list`
            // Yes.

            // Actually checking by ID is safer if usernames change, but username is unique param here.
            // Let's use ID just to be sure.
            const isFav = favorites.some(fav => fav.id === profileId);
            setIsFriend(isFav);
        } catch (err) {
            console.error("Error checking friends", err);
        } finally {
            setCheckingFriend(false);
        }
    };

    const toggleFriend = async () => {
        if (!user || !token) return;

        try {
            if (isFriend) {
                // Unfriend logic
                await axios.delete(`http://localhost:8000/users/favorites/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsFriend(false);
            } else {
                // Add friend logic
                await axios.post(`http://localhost:8000/users/favorites/${user.id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsFriend(true);
            }
        } catch (err) {
            console.error("Failed to toggle friend status", err);
        }
    };

    const fetchPublicMessages = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/messages/public/${username}`);
            setPublicMessages(res.data);
        } catch (err) {
            console.error("Error fetching messages");
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        setSending(true);
        try {
            // Note: The backend route for sending message might need `receiver_username`.
            // Let's check `MessageCreate` schema in backend. It has `receiver_username`.
            await axios.post('http://localhost:8000/messages/', {
                receiver_username: username,
                content: newMessage
            });
            setNewMessage("");
            alert("Sent anonymously!");
        } catch (err) {
            console.error(err);
            alert("Failed to send");
        } finally {
            setSending(false);
        }
    };

    if (!user) return <div className="p-10 text-center">Loading or User not found...</div>;

    return (
        <div className="pb-20">
            <div className="bg-primary pt-8 pb-16 px-4 text-center text-white rounded-b-[2rem]">
                <Avatar className="h-24 w-24 mx-auto border-4 border-white mb-4">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="text-primary text-2xl font-bold bg-white">{user.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{user.name || user.username}</h2>
                <p className="opacity-80">@{user.username}</p>
                {user.bio && <p className="mt-2 text-sm">{user.bio}</p>}

                {token && !checkingFriend && (
                    <div className="mt-4">
                        <Button
                            variant={isFriend ? "secondary" : "secondary"}
                            size="sm"
                            onClick={toggleFriend}
                            className={`group ${isFriend ? "bg-white/20 text-white hover:bg-red-500 hover:text-white transition-colors" : "bg-white text-primary hover:bg-gray-100"}`}
                        >
                            {isFriend ? (
                                <>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    <span className="group-hover:hidden">Friends</span>
                                    <span className="hidden group-hover:inline">Unfriend</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus className="mr-2 h-4 w-4" /> Add Friend
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>

            <div className="px-4 mt-[-2rem] space-y-6">
                {/* Send Message Card */}
                <Card className="shadow-lg border-0">
                    <CardHeader>
                        <CardTitle className="text-center text-lg">Send an anonymous message</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <SimpleTextarea
                            placeholder={`Say something honest to ${user.username}...`}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button className="w-full" onClick={handleSend} disabled={sending || !newMessage.trim()}>
                            {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            Send Secretly
                        </Button>
                    </CardContent>
                </Card>

                {/* Public Messages */}
                <div>
                    <h3 className="font-bold text-gray-500 mb-3 px-2">Public Board</h3>
                    <div className="space-y-3">
                        {publicMessages.length === 0 ? (
                            <p className="text-center text-gray-400 py-4">No public messages yet.</p>
                        ) : (
                            publicMessages.map(msg => (
                                <Card key={msg.id}>
                                    <CardContent className="p-4">
                                        <p className="text-lg font-medium">"{msg.content}"</p>
                                        <p className="text-xs text-gray-400 mt-2 text-right">{new Date(msg.created_at).toLocaleString()}</p>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
