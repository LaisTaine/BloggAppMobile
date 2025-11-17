import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { AppStackParamList } from '../routes/app.routes';

import { useSelector } from 'react-redux';
import { RootState } from '../store';

type CreatePostNavigationProp = NativeStackNavigationProp<AppStackParamList>;

const BASE_URL = 'https://backend-blog-education.onrender.com';

export function CreatePost() {
    const navigation = useNavigation<CreatePostNavigationProp>();

    const token = useSelector((state: RootState) => state.auth.token);

    const [ title, setTitle ] = useState('');
    const [ excerpt, setExcerpt ] = useState('');
    const [ body, setBody ] = useState('');
    const [ loading, setLoading ] = useState(false);

    async function handleCreatePost() {
        if (!title.trim() || !excerpt.trim() || !body.trim()) {
            Alert.alert('Erro', 'Por favor, preencha título, resumo e conteúdo.');
            return;
        }

        if (!token) {
            Alert.alert('Erro', 'Você não está autenticado. Faça login novamente.');
            navigation.navigate('Login');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/api/posts`,
            {
                title: title,
                excerpt: excerpt,
                content: body,
                imageSrc: 'https://via.placeholder.com/150.png?text=Post', 
            }, 
        {
        headers: {
            'Authorization': `Bearer ${token}`
            }
        });
            Alert.alert('Sucesso!', `Post "${response.data.data.title}" criado!`);
            navigation.goBack();

        } catch (error: any) {
        console.log('Erro ao criar post:', error.response?.data || error.message);
        Alert.alert('Erro', 'Não foi possível criar o post.');
        } finally {
        setLoading(false);
        }
    }

    return (
        <ScrollView 
            style={styles.container}
            keyboardShouldPersistTaps="handled" 
        >
        
        <Text style={styles.label}>Título</Text>
        <TextInput
            style={styles.input}
            placeholder="Digite o título"
            value={title}
            onChangeText={setTitle}
        />
        

        <Text style={styles.label}>Resumo </Text>
        <TextInput
            style={styles.input}
            placeholder="Um resumo curto do post"
            value={excerpt}
            onChangeText={setExcerpt}
        />

        <Text style={styles.label}>Conteúdo</Text>
        <TextInput
            style={styles.inputMultiline} 
            placeholder="Escreva seu post aqui..."
            value={body}
            onChangeText={setBody}
            multiline 
            numberOfLines={10} 
        />


        <TouchableOpacity 
            style={styles.button} 
            onPress={handleCreatePost}
            disabled={loading} 
        >
            {loading ? (
            <ActivityIndicator color="#fff" />
            ) : (
            <Text style={styles.buttonText}>Publicar</Text>
            )}
        </TouchableOpacity>
        </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  inputMultiline: {
    width: '100%',
    minHeight: 150, 
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 16, 
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlignVertical: 'top', 
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#28a745', 
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});