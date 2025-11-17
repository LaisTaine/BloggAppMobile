import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Imports de Navegação 
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import { AppStackParamList } from '../routes/app.routes';

// Imports do Redux 
import { useSelector } from 'react-redux';
import { RootState } from '../store';


type EditPostNavigationProp = NativeStackNavigationProp<AppStackParamList>;
type EditPostRouteProp = RouteProp<AppStackParamList, 'EditPost'>;

const BASE_URL = 'https://backend-blog-education.onrender.com';


type PostDetails = {
  title: string;
  excerpt: string;
  content: string;
};

export function EditPost() {
  const navigation = useNavigation<EditPostNavigationProp>();
  const route = useRoute<EditPostRouteProp>();
  const { postId } = route.params; 
  const token = useSelector((state: RootState) => state.auth.token);

  // Estados para o formulário e loading
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); 
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');


  // FUNÇÃO PARA BUSCAR DADOS ATUAIS (GET) 
  useEffect(() => {
    async function fetchPostDetails() {
      try {
        setFetching(true);
        const response = await axios.get(`${BASE_URL}/api/posts/${postId}`);
        const post = response.data.data;
        
        // Preenche o formulário com os dados atuais do post
        setTitle(post.title);
        setExcerpt(post.excerpt);
        setBody(post.content);

      } catch (error: any) {
        console.log('Erro ao buscar post para editar:', error.response?.data);
        Alert.alert('Erro', 'Não foi possível carregar os dados do post.');
      } finally {
        setFetching(false);
      }
    }

    fetchPostDetails();
  }, [postId]); // Roda sempre que o postId mudar


  // FUNÇÃO PARA SALVAR ALTERAÇÕES (PUT)
  async function handleUpdatePost() {
    if (!title.trim() || !excerpt.trim() || !body.trim()) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }
    
    if (!token) {
      Alert.alert('Erro', 'Você não está autenticado.');
      navigation.navigate('Login');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`${BASE_URL}/api/posts/${postId}`, 
      {
        title: title,
        excerpt: excerpt,
        content: body,
        imageSrc: 'https://via.placeholder.com/150.png?text=Post' //placeholder
      }, 
      {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      Alert.alert('Sucesso!', `Post "${response.data.data.title}" atualizado!`);
      navigation.navigate('Main'); // Volta para a Main (que vai recarregar)

    } catch (error: any) {
      console.log('Erro ao atualizar post:', error.response?.data);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    } finally {
      setLoading(false);
    }
  }

  // RENDERIZAÇÃO 
  if (fetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Mostra o formulário 
  return (
    <ScrollView 
      style={styles.container}
      keyboardShouldPersistTaps="handled" 
    >
      
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      
      <Text style={styles.label}>Resumo </Text>
      <TextInput
        style={styles.input}
        value={excerpt}
        onChangeText={setExcerpt}
      />

      <Text style={styles.label}>Conteúdo</Text>
      <TextInput
        style={styles.inputMultiline} 
        value={body}
        onChangeText={setBody}
        multiline 
        numberOfLines={10} 
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleUpdatePost} 
        disabled={loading} 
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}


// ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  
  loadingContainer: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  
  label: {
    fontSize: 16,
    marginTop: 20,
    fontWeight: 'bold',
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
    backgroundColor: '#007bff', 
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