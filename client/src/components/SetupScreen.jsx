import { useState, useEffect } from 'react';

const SetupScreen = ({ onJoin }) => {
    const [name, setName] = useState('');
    const [colors, setColors] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/api/colors')
            .then(res => res.json())
            .then(data => {
                setColors(data.colors);
                setSelectedColor(data.colors[0]);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch colors:', err);
                setLoading(false);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim() && selectedColor) {
            onJoin(name.trim(), selectedColor);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-bg-primary flex items-center justify-center">
                <div className="text-2xl font-bold animate-pulse text-white">Loading colors...</div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/95 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-md bg-bg-glass backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-fade-in my-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black bg-accent-gradient bg-clip-text text-transparent mb-2 drop-shadow-gold">
                        Welcome!
                    </h1>
                    <p className="text-text-secondary">Set up your profile to start claiming blocks</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-secondary ml-1">Your Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name..."
                            maxLength={20}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-white placeholder:text-white/20"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-text-secondary ml-1 block mb-2">Choose Color</label>
                        <div className="grid grid-cols-5 gap-3" style={{ marginTop: '10px' }}>
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-full aspect-square rounded-lg transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center ${selectedColor === color ? 'ring-4 ring-white ring-offset-2 ring-offset-bg-primary scale-110 z-10' : ''
                                        }`}
                                    style={{ backgroundColor: color }}
                                >
                                    {selectedColor === color && (
                                        <svg className="w-5 h-5 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="w-full bg-accent-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-accent-primary/20 transition-all transform hover:-translate-y-1 active:scale-95 mt-4"
                    >
                        Enter Game World
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetupScreen;
