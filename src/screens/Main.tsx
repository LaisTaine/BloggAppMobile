import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../routes/app.routes';

import axios from 'axios';

import { useSelector } from 'react-redux';
import { Header } from '../components/Header';
import { RootState } from '../store';

type MainScreenNavigationProp = NativeStackNavigationProp<AppStackParamList>;

type Post = {
  _id: string; 
  title: string;
  excerpt: string; 
  author: { name: string }; 
};

const BASE_URL = 'https://backend-blog-education.onrender.com';

export function Main() {
    const navigation = useNavigation<MainScreenNavigationProp>();

    const user = useSelector((state: RootState) => state.auth.user);

    const isFocused = useIsFocused();

    const [ loading, setLoading ] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]); // Lista "Mestre"
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]); // Lista "Exibida"
    const [searchQuery, setSearchQuery] = useState(''); // O que o usuário digitou

    async function fetchPosts() {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/api/posts`);
            setPosts(response.data.data);
            const allPosts = response.data.data || response.data;
            setPosts(allPosts); // Atualiza a lista "Mestre"
            setFilteredPosts(allPosts); // No início, a lista exibida é igual à mestre
        } catch (error) {
            console.log('Erro ao buscar posts: ', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (searchQuery === '') {
        // Se a busca está vazia, mostra todos os posts
        setFilteredPosts(posts);
        } else {
        // Se tem algo na busca, filtra!
        const filtered = posts.filter(post => {
            // Checa se o título OU o resumo (excerpt) incluem o texto da busca
            // (toLowerCase deixa a busca 'case-insensitive')
            return (
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setFilteredPosts(filtered); // Atualiza a lista de exibição
        }
    }, [searchQuery, posts]); // Dependências: searchQuery e posts

    function handlePostClick(postId: string) {
        navigation.navigate('ReadPost', { postId: postId });
    }

    function handleEditPost(postId: string) {
        navigation.navigate('EditPost', { postId: postId });
    }

    async function handleDeletePost(postId:string) {
        Alert.alert(
            "Confirmar exclusão",
            "Você tem certeza que quer excluir este post?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", style: "destructive", onPress: () => confirmDelete(postId) }
            ]
        );
    }

    const token = useSelector((state: RootState) => state.auth.token);

        useEffect(() => {
            if (isFocused) {
            fetchPosts();
            }
        }, [isFocused, token]);

    async function confirmDelete(postId: string) {
        if (!token) {
        Alert.alert('Erro', 'Você não está autenticado.');
        return;
        }

        try {
        await axios.delete(`${BASE_URL}/api/posts/${postId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        Alert.alert('Sucesso', 'Post excluído.');
            fetchPosts(); 

        } catch (error: any) {
            console.log('Erro ao deletar post:', error.response?.data);
            Alert.alert('Erro', 'Não foi possível excluir o post.');
        }
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text>Carregando posts...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
      
           <Header title="Blog" />

                
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar posts por palavra-chave..."
                    value={searchQuery}
                    onChangeText={setSearchQuery} // Atualiza o estado da busca
                />
            
                <FlatList
                    data={filteredPosts}
                    keyExtractor={item => item._id}
                    renderItem={({item}) => (
                        <View style={styles.postItem}>

                            <TouchableOpacity onPress={() => handlePostClick(item._id)}>
                                <Text style={styles.postTitle}>{item.title}</Text>
                                <Text style={styles.postExcerpt}>{item.excerpt}</Text>
                                <Text style={styles.postAuthor}>
                                    Por: {item.author?.name || 'Autor Desconhecido'}
                                </Text>
                            </TouchableOpacity>

                            {user?.userType === 'professor' && (
                                <View style={styles.actionsContainer}>
                                    <TouchableOpacity 
                                    style={[styles.actionButton, styles.editButton]}
                                    onPress={() => handleEditPost(item._id)}
                                    >
                                    <Text style={styles.actionButtonText}>Editar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                    style={[styles.actionButton, styles.deleteButton]}
                                    onPress={() => handleDeletePost(item._id)}
                                    >
                                    <Text style={styles.actionButtonText}>Excluir</Text>
                                    </TouchableOpacity>
                                </View>
                                )}
                            </View>
                            )}
                        />
                    </View>
                );
            }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60, 
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5'
    },


  
    postItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd'
    },
  
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    postExcerpt: {
        fontSize: 14,
        color: '#333',
        marginTop: 4,
    },

    postAuthor: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        fontStyle: 'italic',
    },

    loadingContainer: { 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end', 
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 12,
    },
  
    actionButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginLeft: 10,
    },
    
    editButton: {
        backgroundColor: '#ffc107', 
    },
    
    deleteButton: {
        backgroundColor: '#dc3545', 
    },
    
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },


    searchInput: {
        height: 45,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 16, // Espaço antes da lista
    },
});

