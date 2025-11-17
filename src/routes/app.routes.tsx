import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

import { CreatePost } from '../screens/CreatePost';
import { EditPost } from '../screens/EditPost';
import { Login } from '../screens/Login';
import { Main } from '../screens/Main';
import { ReadPost } from '../screens/ReadPost';
import { CreateStudent } from '../screens/users/CreateStudent';
import { CreateTeacher } from '../screens/users/CreateTeacher';
import { EditStudent } from '../screens/users/EditStudent';
import { EditTeacher } from '../screens/users/EditTeacher';
import { ListStudents } from '../screens/users/ListStudents';
import { ListTeachers } from '../screens/users/ListTeachers';

export type AppStackParamList = {
  Login: undefined;
  Main: undefined;
  ReadPost: { postId: string };
  CreatePost: undefined;
  EditPost: { postId: string };
  ListTeachers: undefined;
  CreateTeacher: undefined;
  EditTeacher: { userId: string };
  ListStudents: undefined;
  CreateStudent: undefined;
  EditStudent: { userId: string };
};

const { Navigator, Screen } = createNativeStackNavigator<AppStackParamList>();

export function AppRoutes() {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen 
                name="Login"
                component={Login}
            />
            <Screen
                name="Main"
                component={Main}
            />
            <Screen
                name="ReadPost"
                component={ReadPost}
                options={{ 
                    headerShown: true, 
                    title: 'Leitura do Post' 
                }}
            />
            <Screen 
                name="CreatePost" 
                component={CreatePost}
                options={{ 
                    headerShown: true, 
                    title: 'Criar Novo Post'
                }} 
            />
            <Screen
                name="EditPost"
                component={EditPost}
                options={{ 
                    headerShown: true, 
                    title: 'Editar Post'
                }}
            />
            <Screen 
                name="ListTeachers" 
                component={ListTeachers}
                options={({ navigation }) => ({ 
                    headerShown: true, 
                    title: 'Gerenciar Professores',

                    headerRight: () => (
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('CreateTeacher')}
                            style={{ marginRight: 10 }} 
                        >
                            <Feather name="plus-circle" size={24} color="#007bff" />
                        </TouchableOpacity>
                        ),
                    })}
            /> 
            <Screen 
                name="CreateTeacher" 
                component={CreateTeacher}
                options={{ 
                    headerShown: true, 
                    title: 'Cadastrar Professor'
                }} 
            /> 
            <Screen 
                name="EditTeacher" 
                component={EditTeacher}
                options={{ 
                    headerShown: true, 
                    title: 'Editar Professor'
                }} 
            />
            <Screen 
                name="ListStudents" 
                component={ListStudents}
                options={({ navigation }) => ({ 
                    headerShown: true, 
                    title: 'Gerenciar Estudantes',
                    headerRight: () => (
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('CreateStudent')}
                        style={{ marginRight: 10 }}
                    >
                        <Feather name="plus-circle" size={24} color="#007bff" />
                    </TouchableOpacity>
                    ),
                })}
            />
            <Screen
                name="CreateStudent"
                component={CreateStudent}
                options={{ 
                    headerShown: true, 
                    title: 'Cadastrar Estudantes'
                }}
            />
            <Screen
                name="EditStudent"
                component={EditStudent}
                options={{ 
                    headerShown: true, 
                    title: 'Editar Estudantes'
                }}
            />
            
        </Navigator>
    );
}