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
import { AppStackParamList } from '../../routes/app.routes'; // ../../
// Imports do Redux 
import { useSelector } from 'react-redux';
import { RootState } from '../../store'; // ../../

// TIPAGEM 
type EditTeacherNavigationProp = NativeStackNavigationProp<AppStackParamList>;
type EditTeacherRouteProp = RouteProp<AppStackParamList, 'EditTeacher'>; // Usar a rota 'EditTeacher'

const BASE_URL = 'https://backend-blog-education.onrender.com';

export function EditTeacher() {
  const navigation = useNavigation<EditTeacherNavigationProp>();
  const route = useRoute<EditTeacherRouteProp>();
  const { userId } = route.params; 

  // PEGAR O TOKEN DO REDUX 
  const token = useSelector((state: RootState) => state.auth.token);

  // Estados
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [age, setAge] = useState(''); 

  // FUNÇÃO PARA BUSCAR DADOS ATUAIS (GET) 
  // GET /api/users/:id precisa de autenticação
  useEffect(() => {
    async function fetchUserDetails() {
      if (!token) {
        Alert.alert('Erro', 'Você não está autenticado.');
        navigation.navigate('Login');
        return;
      }
      try {
        setFetching(true);
        // Endpoint para buscar um usuário específico
        const response = await axios.get(`${BASE_URL}/api/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const user = response.data.data; // A API real parece aninhar em 'data'
        
        // Preenche o formulário com os dados atuais
        setName(user.name);
        setEmail(user.email);
        setSchool(user.school);
        setAge(String(user.age));

      } catch (error: any) {
        console.log('Erro ao buscar usuário:', error.response?.data);
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
      } finally {
        setFetching(false);
      }
    }

    fetchUserDetails();
  }, [userId, token, navigation]);

  // FUNÇÃO PARA SALVAR ALTERAÇÕES (PUT) 
  // PUT /api/users/:id - para professores
  async function handleUpdateTeacher() {
    if (!name.trim() || !email.trim() || !school.trim() || !age.trim()) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }
    
    if (!token) {
      Alert.alert('Erro', 'Sessão expirada. Faça login novamente.');
      navigation.navigate('Login');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`${BASE_URL}/api/users/${userId}`, 
      {
        name: name,
        email: email,
        school: school,
        age: parseInt(age),
      }, 
      {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      Alert.alert('Sucesso!', `Professor "${response.data.data.name}" atualizado!`);
      navigation.goBack(); 

    } catch (error: any) {
      console.log('Erro ao atualizar professor:', error.response?.data);
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

  return (
    <ScrollView 
      style={styles.container}
      keyboardShouldPersistTaps="handled" 
    >
      
      <Text style={styles.label}>Nome Completo</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/*sem senha aqui, fluxo separado (PUT /password) */}

      <Text style={styles.label}>Escola</Text>
      <TextInput
        style={styles.input}
        value={school}
        onChangeText={setSchool}
      />

      <Text style={styles.label}>Idade</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        keyboardType="numeric" 
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleUpdateTeacher} 
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