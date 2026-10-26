import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../application/hooks/useAuth';
import { useAuthForm } from '../../application/hooks/useAuthForm';
import { AuthForm } from '../components/AuthForm';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation, route }: Props) {
  const { signIn } = useAuth();
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    setError,
    runAuthAction,
  } = useAuthForm('Sign in failed.');

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    await runAuthAction(async () => {
      await signIn(email.trim(), password);
    });
  };

  return (
    <AuthForm
      subtitle="Sign in to continue"
      email={email}
      onEmailChange={setEmail}
      password={password}
      onPasswordChange={setPassword}
      error={error}
      infoMessage={route.params?.infoMessage}
      loading={loading}
      submitLabel="Sign In"
      submitAccessibilityLabel="Sign in"
      loadingAccessibilityLabel="Signing in"
      onSubmit={handleSignIn}
      switchLabel="Don't have an account? Sign Up"
      switchAccessibilityLabel="Go to create account screen"
      onSwitch={() => navigation.navigate('SignUp')}
    />
  );
}
