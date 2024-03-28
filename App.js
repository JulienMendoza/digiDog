import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text, Button } from 'react-native';
import { Audio } from 'expo-av';
import dogImage from './assets/dog1.gif';
import sadDogImage from './assets/sad_dog.jpg';
import happyDogImage from './assets/dog2.gif';
import barkSound from './assets/barkSound.mp3';

export default function App() {
    const [isBarking, setIsBarking] = useState(false);
    const [happinessLevel, setHappinessLevel] = useState(20);
    const [imageSource, setImageSource] = useState(dogImage);

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
            setImageSource(happyDogImage); // Set image to dog2.gif when barking
            soundObject.setOnPlaybackStatusUpdate((status) => {
                if (!status.isPlaying) {
                    setIsBarking(false);
                    if (happinessLevel > 10) {
                        setImageSource(dogImage);
                    } else {
                        setImageSource(sadDogImage);
                    }
                }
            });
        } catch (error) {
            console.error('Error playing bark sound: ', error);
        }
    };

    const handleFeed = () => {
        setHappinessLevel(20); // Reset happiness level to 20 when fed
    };

    const handlePress = () => {
        if (!isBarking) {
            setIsBarking(true);
            playBarkSound();
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePress}>
                <View style={styles.imageContainer}>
                    <Image
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
