for t in range(T):
    # Noise
    eps_eco = sample_eco_noise()
    eps_int = sample_internal_noise(N)
    eps_per = sample_perceptual_noise(N)
    eps_act = sample_action_noise(N)

    # Contextual field
    N_act = A @ S_act @ W_N.T
    N_env = E_to_agents(E[t] + eps_eco, N)
    X_ctx = N_act + N_env

    S_int_tilde, S_per_tilde, S_act_tilde = [], [], []

    for i in range(N):
        # Internal
        s_int = I_hat(S_int[i]) + C_hat(S_int[i]) + eps_int[i]

        # Perceptual
        Z = W_PE @ S_per[i] + W_PX @ X_ctx[i] + eps_per[i]
        s_per = clip(Z, L, U) + T_hat(S_per[i], S_int[i])

        # Action
        s_act = T_hat(S_int[i], S_per[i]) + C_hat(S_act[i]) + eps_act[i]
        s_act -= eta_H * grad_H_i(S_act[i])

        # Local governance
        s_int, s_per, s_act = G_hat_i(s_int, s_per, s_act)

        S_int_tilde.append(s_int)
        S_per_tilde.append(s_per)
        S_act_tilde.append(s_act)

    # Stack
    S_int_tilde = stack(S_int_tilde)
    S_per_tilde = stack(S_per_tilde)
    S_act_tilde = stack(S_act_tilde)

    # Global governance
    S_int, S_per, S_act = G_hat_eco(
        S_int_tilde, S_per_tilde, S_act_tilde, E[t] + eps_eco
    )
