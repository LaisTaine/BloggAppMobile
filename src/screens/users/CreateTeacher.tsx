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
import { AppStackParamList } from '../../routes/app.routes';

// Tipagem
type CreateTeacherNavigationProp = NativeStackNavigationProp<AppStackParamList>;
const BASE_URL = 'https://backend-blog-education.onrender.com';

export function CreateTeacher() {
  const navigation = useNavigation<CreateTeacherNavigationProp>();

  // ESTADOS PARA O FORMULÁRIO (CONFORME A API)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState('');
  const [age, setAge] = useState(''); 
  const [loading, setLoading] = useState(false);

  async function handleCreateTeacher() {
    // VALIDAÇÃO
    if (!name.trim() || !email.trim() || !password.trim() || !school.trim() || !age.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      // CHAMADA POST (NÃO PRECISA DE TOKEN, CONFORME A DOC)
      const response = await axios.post(`${BASE_URL}/api/users/register`, {
        name: name,
        email: email,
        password: password,
        school: school,
        age: parseInt(age), 
        userType: 'professor' 
      });

      // 4. SUCESSO!
      Alert.alert('Sucesso!', `Professor "${response.data.data.user.name}" criado!`);
      navigation.goBack(); 

    } catch (error: any) {
      console.log('Erro ao criar professor:', error.response?.data);
      Alert.alert('Erro', 'Não foi possível criar o professor. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView 
      style={styles.container}
      keyboardShouldPersistTaps="handled" 
    >
      
      {/* CAMPOS DO FORMULÁRIO  */}
      <Text style={styles.label}>Nome Completo</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome"
        value={name}
        onChangeText={setName}
      />
      
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry 
      />

      <Text style={styles.label}>Escola</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome da escola"
        value={school}
        onChangeText={setSchool}
      />

      <Text style={styles.label}>Idade</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a idade"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric" 
      />

      {/* --- Botão Publicar --- */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleCreateTeacher}
        disabled={loading} 
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar Professor</Text>
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