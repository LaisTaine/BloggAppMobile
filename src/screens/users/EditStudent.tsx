import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
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
import { useSelector } from 'react-redux';
import { AppStackParamList } from '../../routes/app.routes'; // ../../
import { RootState } from '../../store'; // ../../

// TIPAGEM 
type EditStudentNavigationProp = NativeStackNavigationProp<AppStackParamList>;
type EditStudentRouteProp = RouteProp<AppStackParamList, 'EditStudent'>; 

const BASE_URL = 'https://backend-blog-education.onrender.com';

export function EditStudent() {
  const navigation = useNavigation<EditStudentNavigationProp>();
  const route = useRoute<EditStudentRouteProp>();
  const { userId } = route.params; 

  const token = useSelector((state: RootState) => state.auth.token);

  //  ESTADOS (Incluindo os campos de aluno) 
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [age, setAge] = useState(''); 
  const [guardian, setGuardian] = useState('');
  const [studentClass, setStudentClass] = useState(''); 

  // FUNÇÃO PARA BUSCAR DADOS ATUAIS (GET) 
  useEffect(() => {
    async function fetchUserDetails() {
      if (!token) {
        Alert.alert('Erro', 'Você não está autenticado.');
        navigation.navigate('Login');
        return;
      }
      try {
        setFetching(true);
        // Endpoint GET /api/users/:id (requer token)
        const response = await axios.get(`${BASE_URL}/api/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const user = response.data.data; 
        
        // Preenche o formulário com dados atuais
        setName(user.name);
        setEmail(user.email);
        setSchool(user.school);
        setAge(String(user.age));
        setGuardian(user.guardian || ''); 
        setStudentClass(user.class || ''); 

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
  async function handleUpdateStudent() {
    // Validação
    if (!name.trim() || !email.trim() || !school.trim() || !age.trim() || !guardian.trim() || !studentClass.trim()) {
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
      // Endpoint PUT /api/users/:id (requer token de Professor)
      const response = await axios.put(`${BASE_URL}/api/users/${userId}`, 
      {
        name: name,
        email: email,
        school: school,
        age: parseInt(age),
        guardian: guardian, // 
        class: studentClass
      }, 
      {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      Alert.alert('Sucesso!', `Estudante "${response.data.data.name}" atualizado!`);
      navigation.goBack(); // 

    } catch (error: any) {
      console.log('Erro ao atualizar estudante:', error.response?.data);
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
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      
      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

      <Text style={styles.label}>Escola</Text>
      <TextInput style={styles.input} value={school} onChangeText={setSchool} />

      <Text style={styles.label}>Idade</Text>
      <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />
      
      {/*CAMPOS EXTRAS DE ALUNO */}
      <Text style={styles.label}>Nome do Responsável (Guardian)</Text>
      <TextInput style={styles.input} value={guardian} onChangeText={setGuardian} />
      
      <Text style={styles.label}>Turma (Class)</Text>
      <TextInput style={styles.input} value={studentClass} onChangeText={setStudentClass} />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleUpdateStudent}
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