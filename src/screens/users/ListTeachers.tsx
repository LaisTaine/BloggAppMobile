import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSelector } from 'react-redux';
import { AppStackParamList } from '../../routes/app.routes';
import { RootState } from '../../store';

// Tipagem
type ListTeachersNavigationProp = NativeStackNavigationProp<AppStackParamList>;
const BASE_URL = 'https://backend-blog-education.onrender.com';

// tipo para o Usuário
type User = {
  _id: string;
  name: string;
  email: string;
  userType: 'professor' | 'aluno';
};

export function ListTeachers() {
  const navigation = useNavigation<ListTeachersNavigationProp>();
  const isFocused = useIsFocused(); // Para recarregar a lista

  const user = useSelector((state: RootState) => state.auth.user);

  // Pegar o token do Redux
  const token = useSelector((state: RootState) => state.auth.token);

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  // FUNÇÃO PARA BUSCAR USUÁRIOS (GET com Token) 
  async function fetchUsers() {
    if (!token) {
      Alert.alert('Erro', 'Você não está autenticado.');
      navigation.navigate('Login');
      return;
    }
    
    try {
      setLoading(true);
      // Endpoint da API para listar usuários
      const response = await axios.get(`${BASE_URL}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      
      // Filtro para mostrar apenas professores
      const allUsers = response.data.data || response.data;
      const teachers = allUsers.filter((user: User) => user.userType === 'professor');
      
      setUsers(teachers);

    } catch (error: any) {
      console.log('Erro ao buscar usuários:', error.response?.data);
      Alert.alert('Erro', 'Não foi possível carregar os usuários.');
    } finally {
      setLoading(false);
    }
  }

  //  useEffect para carregar ao focar 
  useEffect(() => {
    if (isFocused) {
      fetchUsers();
    }
  }, [isFocused, token]); // Roda se a tela focar OU se o token mudar

  // FUNÇÕES (PLACEHOLDER) 
  function handleEditTeacher(userId: string) {
    navigation.navigate('EditTeacher', { userId: userId });
  }

  function handleDeleteTeacher(userId: string) {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que quer excluir este professor? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: () => confirmDelete(userId) // Chama a nova função
        }
      ]
    );
  }

  async function confirmDelete(userId: string) {
    if (!token) {
      Alert.alert('Erro', 'Você não está autenticado.');
      return;
    }

    try {
      // Endpoint para DELETAR usuário (requer token de Professor, segundo a doc)
      await axios.delete(`${BASE_URL}/api/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      Alert.alert('Sucesso', 'Professor excluído.');
      
      // Força a lista a recarregar 
      fetchUsers(); 

    } catch (error: any) {
      console.log('Erro ao excluir professor:', error.response?.data);
      Alert.alert('Erro', 'Não foi possível excluir o professor.');
    }
  }

  // RENDERIZAÇÃO
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      

      {/* Lista de Professores */}
      <FlatList
        data={users}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            {/* Informações */}
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>

            {/* Ações (Editar/Excluir) */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleEditTeacher(item._id)}
              >
                <Text style={styles.actionButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteTeacher(item._id)}
              >
                <Text style={styles.actionButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
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

  createButton: {
    backgroundColor: '#007bff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 24,
    lineHeight: 28,
  },

  userItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userInfo: {
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
});