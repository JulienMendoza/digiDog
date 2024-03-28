import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text, Button, Vibration } from 'react-native';
import { Audio } from 'expo-av';
import * as Animatable from 'react-native-animatable';
import dogImage from './assets/dog1.gif';
import sadDogImage from './assets/sad_dog.jpg';
import happyDogImage from './assets/dog2.gif';
import barkSound from './assets/barkSound.mp3';

export default function App() {
    const [isBarking, setIsBarking] = useState(false);
    const [happinessLevel, setHappinessLevel] = useState(20);
    const [imageSource, setImageSource] = useState(dogImage);
    const vibrationRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (happinessLevel > 0) {
                setHappinessLevel(happinessLevel - 1);
                if (happinessLevel <= 10) {
                    setImageSource(sadDogImage);
                } else {
                    setImageSource(dogImage);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [happinessLevel]);

    const playBarkSound = async () => {
        const soundObject = new Audio.Sound();

        try {
            await soundObject.loadAsync(barkSound);
            await soundObject.playAsync();
            setIsBarking(true);
            setImageSource(happyDogImage);
            Vibration.vibrate([400, 200, 400, 200, 400]); // vibration pattern
            vibrationRef.current.pulse({ duration: 1000, infinite: true });
            soundObject.setOnPlaybackStatusUpdate((status) => {
                if (!status.isPlaying) {
                    setIsBarking(false);
                    setImageSource(dogImage); // Reset image to dog1.gif when barking ends
                    Vibration.cancel();
                    vibrationRef.current.stopAnimation(); // Stop pulsating animation
                }
            });
        } catch (error) {
            console.error('Error playing bark sound: ', error);
        }
    };

    const handleFeed = () => {
        setHappinessLevel(20); // Feed the dog to reset the happiness level to 20
        setImageSource(dogImage); // Reset image to dog1.gif when fed
    };

    const handlePress = () => {
        if (!isBarking) {
            setIsBarking(true);
            playBarkSound();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>This is Digi-Dog</Text>
            <TouchableOpacity onPress={handlePress}>
                <View style={styles.imageContainer}>
                    <Animatable.Image
                        ref={vibrationRef}
                        source={imageSource}
                        style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'cover',
                            borderRadius: 20,
                        }}
                    />
                </View>
            </TouchableOpacity>
            <Text style={styles.happinessLevel}>Happiness: {happinessLevel}</Text>
            <Button onPress={handleFeed} title="Feed the Dog" />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    imageContainer: {
        width: 200,
        height: 200,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'black',
    },
    happinessLevel: {
        fontSize: 24,
        marginTop: 10,
    },
});
