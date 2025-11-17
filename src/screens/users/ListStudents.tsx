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

import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


import axios from 'axios';
import { useSelector } from 'react-redux';
import { AppStackParamList } from '../../routes/app.routes';
import { RootState } from '../../store';

// Tipagem
type ListStudentsNavigationProp = NativeStackNavigationProp<AppStackParamList>;
const BASE_URL = 'https://backend-blog-education.onrender.com';

type User = {
  _id: string;
  name: string;
  email: string;
  userType: 'professor' | 'aluno';
  isActive: boolean;
};

export function ListStudents() {
  const navigation = useNavigation<ListStudentsNavigationProp>();
  const isFocused = useIsFocused();
  const token = useSelector((state: RootState) => state.auth.token);

  const user = useSelector((state: RootState) => state.auth.user);

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  //FUNÇÃO PARA BUSCAR USUÁRIOS
  async function fetchUsers() {
    if (!token) {
      Alert.alert('Erro', 'Você não está autenticado.');
      navigation.navigate('Login');
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const allUsers = response.data.data || response.data;
      
      const students = allUsers.filter((user: User) => 
        user.userType === 'aluno' && user.isActive === true
      );
      
      setUsers(students); 

    } catch (error: any) {
      console.log('Erro ao buscar usuários:', error.response?.data);
      Alert.alert('Erro', 'Não foi possível carregar os usuários.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isFocused) {
      fetchUsers();
    }
  }, [isFocused, token]);

  // FUNÇÕES DE NAVEGAÇÃO 
  function handleEditStudent(userId: string) {
    navigation.navigate('EditStudent', { userId: userId });
  }

  function handleDeleteStudent(userId: string) {
      Alert.alert(
        "Confirmar Exclusão",
        "Tem certeza que quer excluir este estudante?",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Excluir", 
            style: "destructive", 
            onPress: () => confirmDelete(userId) 
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
      
          await axios.delete(`${BASE_URL}/api/users/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

    
          Alert.alert('Sucesso', 'Estudante excluído.');
          
       
          fetchUsers(); 

        } catch (error: any) {
 
          const errorMessage = error.response?.data?.message || 'Não foi possível excluir o estudante.';
          console.log('Erro ao excluir estudante:', error.response?.data);
          Alert.alert('Erro na Exclusão', errorMessage);
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


      <FlatList
        data={users}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleEditStudent(item._id)} 
              >
                <Text style={styles.actionButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteStudent(item._id)} 
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

// ESTILOS (copiei de ListTeachers)
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