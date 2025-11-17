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
type CreateStudentNavigationProp = NativeStackNavigationProp<AppStackParamList>;
const BASE_URL = 'https://backend-blog-education.onrender.com';

export function CreateStudent() {
  const navigation = useNavigation<CreateStudentNavigationProp>();

  // ESTADOS PARA O FORMULÁRIO 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState('');
  const [age, setAge] = useState('');
  const [guardian, setGuardian] = useState(''); // CAMPO (Responsável)
  const [studentClass, setStudentClass] = useState(''); // CAMPO (Turma)
  const [loading, setLoading] = useState(false);

  async function handleCreateStudent() {
    if (!name.trim() || !email.trim() || !password.trim() || !school.trim() || !age.trim() || !guardian.trim() || !studentClass.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/users/register`, {
        name: name,
        email: email,
        password: password,
        school: school,
        age: parseInt(age),
        userType: 'aluno', 
        guardian: guardian, 
        class: studentClass 
      });

      Alert.alert('Sucesso!', `Estudante "${response.data.data.user.name}" criado!`);
      navigation.goBack(); 

    } catch (error: any) {
      console.log('Erro ao criar estudante:', error.response?.data);
      Alert.alert('Erro', 'Não foi possível criar o estudante. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView 
      style={styles.container}
      keyboardShouldPersistTaps="handled" 
    >
      
      {/*CAMPOS DO FORMULÁRIO */}
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
      
      <Text style={styles.label}>Nome do Responsável </Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do responsável"
        value={guardian}
        onChangeText={setGuardian}
      />
      
      <Text style={styles.label}>Turma (Class)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 8A, 3B, etc."
        value={studentClass}
        onChangeText={setStudentClass}
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleCreateStudent}
        disabled={loading} 
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar Estudante</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

// ESTILOS (Copiei de CREATETEACHER.TSX)
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
    backgroundColor: '#28a745', // Verde
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