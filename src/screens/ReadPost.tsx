import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../routes/app.routes';

import axios from 'axios';

type ReadPostNavigationProp = NativeStackNavigationProp<AppStackParamList>;

type ReadPostRouteProp = RouteProp<AppStackParamList, 'ReadPost'>;

type PostDetails = {
  _id: string;
  title: string;
  content: string; // A API do grupo usa 'content' (em vez de 'body')
  author: { name: string };
};

const BASE_URL = 'https://backend-blog-education.onrender.com';

export function ReadPost() {
    const navigation = useNavigation<ReadPostNavigationProp>();
    const route = useRoute<ReadPostRouteProp>();

    const { postId } = route.params;

    const [ loading, setLoading ] = useState(true);
    const [ post, setPost ] = useState<PostDetails | null>(null);

    async function fetchPostDetails() {
        try {
            setLoading(true);
            const response = await axios.get(
            `${BASE_URL}/api/posts/${postId}`
            );
            setPost(response.data.data || response.data);
        } catch (error) {
            console.log('Erro ao buscar detalhes do post: ', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPostDetails();
    }, [postId]);

    function handleGoBack() {
    navigation.goBack(); 
    }

    if (loading) {
        return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text>Carregando post...</Text>
        </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {post ? (
                <>
                    <Text style={styles.title}>{post.title}</Text>
                    <Text style={styles.author}>Por: {post.author?.name || 'Autor Desconhecido'}</Text>
                    <Text style={styles.body}>{post.content}</Text>
                </>
            ) : (
                <Text>Post não encontrado.</Text>
            )}
            
            <TouchableOpacity style={styles.button} onPress={handleGoBack}>
                <Text style={styles.buttonText}>Voltar para a Lista</Text>
            </TouchableOpacity>
            </ScrollView>
        );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  body: {
    fontSize: 16,
    lineHeight: 24, // Melhora a leitura
    color: '#333',
  },
  button: {
    backgroundColor: '#6c757d',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16, // Aumentamos o padding
    marginTop: 20,
    marginBottom: 40, // Espaço no final
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});