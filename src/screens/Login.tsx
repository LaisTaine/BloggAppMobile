import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import { AppStackParamList } from '../routes/app.routes';

import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCredentials } from '../store/authSlice';

type LoginScreenNavigationProp = NativeStackNavigationProp<AppStackParamList>;


export function Login() {
    const [ user, setUser ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ loading, setLoading ] = useState(false);

    const navigation = useNavigation<LoginScreenNavigationProp>();
    const dispatch = useDispatch<AppDispatch>();

    async function handleLogin() {
        if (!user.trim() || !password.trim()) {
            Alert.alert('Erro', 'Por favor, preencha email e senha.');
        return;
        }

        setLoading(true);
        const BASE_URL = 'https://backend-blog-education.onrender.com';

        try {
        const response = await axios.post(`${BASE_URL}/api/users/login`, {
            email: user, 
            password: password,
        });

        const token = response.data.data.token;
        const loggedInUser = response.data.data.user;

        dispatch(setCredentials({ token: token, user: loggedInUser }));
        await AsyncStorage.setItem('@BlogApp:token', token);
        await AsyncStorage.setItem('@BlogApp:user', JSON.stringify(loggedInUser));

        navigation.navigate('Main');

        } catch (error: any) {
            console.log('Erro no login:', error.response?.data || error.message);
            Alert.alert(
                'Erro no Login', 
                'Email ou senha inválidos. Tente novamente.'
            );
            } finally {

        setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>BlogApp Mobile</Text>


            <TextInput
                style={styles.input}
                placeholder="Email do Professor"
                onChangeText={setUser}
                value={user}
                keyboardType="email-address"
                autoCapitalize="none"
            />


            <TextInput
                style={styles.input}
                placeholder="Senha"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
            />

            <TouchableOpacity 
                style={styles.button} 
                onPress={handleLogin}
                disabled={loading}
                >

                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (    
                    <Text style={styles.buttonText}>Entrar</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
    },

    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd'
    },

    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#007bff',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },

    buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    },

});




