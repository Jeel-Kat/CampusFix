import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, googleProvider } from '../config/firebase';
import FullPageLoader from '../components/FullPageLoader';
import { 
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signOut, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null); // 'student' or 'admin'
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Monitor online status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Helper to safely get user role from Firestore
    const fetchUserRole = async (user) => {
        if (!isOnline) {
            console.warn('Offline - using default student role');
            return 'student';
        }
        try {
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                return userSnap.data().role || 'student';
            }
            return 'student';
        } catch (error) {
            console.warn('Error fetching role, defaulting to student:', error.message);
            return 'student';
        }
    };

    // Helper to safely create/update user in Firestore
    const createUserDocument = async (user, role = 'student') => {
        if (!isOnline) {
            console.warn('Offline - skipping Firestore user creation');
            return;
        }
        try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                email: user.email,
                displayName: user.displayName,
                role: role,
                createdAt: new Date()
            }, { merge: true });
        } catch (error) {
            console.warn('Error creating user document:', error.message);
        }
    };

    // Google Sign-in
    const loginWithGoogle = async () => {
        // Timeout for popup flow; if it doesn't complete, fallback to redirect
        const popupTimeoutMs = 10000;
        try {
            // Try popup first, but race against a timeout to detect environments where popup checks are blocked (e.g. COOP)
            const popupPromise = signInWithPopup(auth, googleProvider);
            const result = await Promise.race([
                popupPromise,
                new Promise((_, reject) => setTimeout(() => reject({ code: 'auth/popup-timeout', message: 'Popup timed out' }), popupTimeoutMs))
            ]);
            const user = result.user;

            // Check if user exists in Firestore, if not create as student
            const role = await fetchUserRole(user);
            if (role === 'student') {
                await createUserDocument(user, 'student');
            }
            setUserRole(role);
            return user;
        } catch (error) {
            // If popup blocked, closed, timed out, or COOP-related, try redirect
            const msg = (error && error.message) ? error.message : '';
            if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user' || error.code === 'auth/popup-timeout' || msg.includes('Cross-Origin-Opener-Policy')) {
                console.log('Popup unavailable (blocked/timeout/COOP), falling back to redirect...');
                await signInWithRedirect(auth, googleProvider);
                return null;
            }
            console.error("Google login failed", error);
            throw error;
        }
    };

    // Email/Password Sign-up
    const signupWithEmail = async (email, password, displayName) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const user = result.user;

            // Update display name
            await updateProfile(user, { displayName });

            // Create Firestore document
            await createUserDocument({ ...user, displayName }, 'student');
            setUserRole('student');
            return user;
        } catch (error) {
            console.error("Email signup failed", error);
            throw error;
        }
    };

    // Email/Password Sign-in
    const loginWithEmail = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const user = result.user;

            // Get user role
            const role = await fetchUserRole(user);
            setUserRole(role);
            return user;
        } catch (error) {
            console.error("Email login failed", error);
            throw error;
        }
    };

    const logout = () => {
        setUserRole(null);
        return signOut(auth);
    };

    // Handle redirect result on page load
    useEffect(() => {
        getRedirectResult(auth).then((result) => {
            if (result?.user) {
                fetchUserRole(result.user).then(role => {
                    if (role === 'student') {
                        createUserDocument(result.user, 'student');
                    }
                    setUserRole(role);
                });
            }
        }).catch(console.error);
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                const role = await fetchUserRole(user);
                setUserRole(role);
            } else {
                setUserRole(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [isOnline]);

    const value = {
        currentUser,
        userRole,
        isOnline,
        loading,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <FullPageLoader /> : children}
        </AuthContext.Provider>
    );
};
