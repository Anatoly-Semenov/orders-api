import { MigrationInterface, QueryRunner } from 'typeorm'

export class stabilizationDb1685328061399 implements MigrationInterface {
	name = 'stabilizationDb1685328061399'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "addresses_working_time" DROP CONSTRAINT "addresses_working_time_addressId_fkey"`,
		)
		await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "files_userId_fkey"`)
		await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "files_clientId_fkey"`)
		await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "files_addressId_fkey"`)
		await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "files_servicesId_fkey"`)
		await queryRunner.query(
			`ALTER TABLE "additional_enable_services" DROP CONSTRAINT "additional_enable_services_parentId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_additional_service" DROP CONSTRAINT "order_additional_service_orderServiceId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_free_additional_service" DROP CONSTRAINT "order_free_additional_service_orderServiceId_fkey"`,
		)
		await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "payments_orderId_fkey"`)
		await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "orders_clientId_fkey"`)
		await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "orders_addressId_fkey"`)
		await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_fkey"`)
		await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "orders_customerId_fkey"`)
		await queryRunner.query(
			`ALTER TABLE "order_service" DROP CONSTRAINT "order_service_targetId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_service" DROP CONSTRAINT "order_service_orderId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "services_target" DROP CONSTRAINT "services_target_servicesId_fkey"`,
		)
		await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "services_clientId_fkey"`)
		await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "services_categoryId_fkey"`)
		await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "addresses_clientId_fkey"`)
		await queryRunner.query(
			`ALTER TABLE "clients_payments_settings_methods_meta" DROP CONSTRAINT "clients_payments_settings_methods_meta_methodId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "client_payments_settings_methods" DROP CONSTRAINT "client_payments_settings_methods_paymentSettingsId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "notifications" DROP CONSTRAINT "notifications_clientId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "client_integration" DROP CONSTRAINT "client_integration_clientId_fkey"`,
		)
		await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "clients_usersInviteId_fkey"`)
		await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "clients_merchantDataId_fkey"`)
		await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "clients_ownerId_fkey"`)
		await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "clients_paymentId_fkey"`)
		await queryRunner.query(
			`ALTER TABLE "user_schedules" DROP CONSTRAINT "user_schedules_userId_fkey"`,
		)
		await queryRunner.query(`ALTER TABLE "users_photo" DROP CONSTRAINT "users_photo_userId_fkey"`)
		await queryRunner.query(`ALTER TABLE "users_card" DROP CONSTRAINT "users_card_userId_fkey"`)
		await queryRunner.query(`ALTER TABLE "recurrent" DROP CONSTRAINT "recurrent_rateId_fkey"`)
		await queryRunner.query(`ALTER TABLE "users_hashs" DROP CONSTRAINT "users_hashs_userId_fkey"`)
		await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "users_recurrentId_fkey"`)
		await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "users_hashId_fkey"`)
		await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "tokens_userId_fkey"`)
		await queryRunner.query(
			`ALTER TABLE "clients_categories_types" DROP CONSTRAINT "clients_categories_types_categoryId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients_meta" DROP CONSTRAINT "clients_meta_clientId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_service_snapshot" DROP CONSTRAINT "order_service_snapshot_orderServiceId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_service_snapshot" DROP CONSTRAINT "order_service_snapshot_orderAdditionalServicesId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "additional_service" DROP CONSTRAINT "additional_service_clientId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "additional_service" DROP CONSTRAINT "additional_service_prepaymentParamsId_fkey"`,
		)
		await queryRunner.query(`ALTER TABLE "users_meta" DROP CONSTRAINT "users_meta_userId_fkey"`)
		await queryRunner.query(
			`ALTER TABLE "service_addresses" DROP CONSTRAINT "service_addresses_servicesId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "service_addresses" DROP CONSTRAINT "service_addresses_addressesId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "service_parent_additional" DROP CONSTRAINT "service_parent_additional_servicesId_2_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "service_parent_additional" DROP CONSTRAINT "service_parent_additional_servicesId_1_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_invite_roles_users_roles" DROP CONSTRAINT "user_invite_roles_users_roles_usersRolesId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_invite_roles_users_roles" DROP CONSTRAINT "user_invite_roles_users_roles_userInviteId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_invite_clients_clients" DROP CONSTRAINT "user_invite_clients_clients_clientsId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_invite_clients_clients" DROP CONSTRAINT "user_invite_clients_clients_userInviteId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_clients_clients" DROP CONSTRAINT "users_clients_clients_clientsId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_clients_clients" DROP CONSTRAINT "users_clients_clients_usersId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_roles_users_roles" DROP CONSTRAINT "users_roles_users_roles_usersId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_roles_users_roles" DROP CONSTRAINT "users_roles_users_roles_usersRolesId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "additional_service_addresses_addresses" DROP CONSTRAINT "additional_service_addresses_addresses_additionalServiceId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "additional_service_addresses_addresses" DROP CONSTRAINT "additional_service_addresses_addresses_addressesId_fkey"`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_customer" ADD CONSTRAINT "UQ_99ee315cdaeb17b6b141efdbb39" UNIQUE ("userEmail")`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_invite" ADD CONSTRAINT "UQ_4782feb92faa0e0a1ce81afb462" UNIQUE ("email")`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_invite" ADD CONSTRAINT "UQ_caa2eb015b7b008d71dfb27674b" UNIQUE ("hash")`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients" ADD CONSTRAINT "UQ_65cc60df913867ccb2c5f3d0776" UNIQUE ("idAlias")`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients" ADD CONSTRAINT "UQ_ef6b5dfa4df1560fd0fea7e952f" UNIQUE ("paymentId")`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients" ADD CONSTRAINT "UQ_f1d6695b088da25ec36e8916f22" UNIQUE ("merchantDataId")`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_hashs" ADD CONSTRAINT "UQ_c2e016a80b172789989251a69a2" UNIQUE ("userId")`,
		)
		await queryRunner.query(
			`ALTER TABLE "users" ADD CONSTRAINT "UQ_a1dd4b2ac8cbaf5d11503bac653" UNIQUE ("recurrentId")`,
		)
		await queryRunner.query(
			`ALTER TABLE "users" ADD CONSTRAINT "UQ_125b0fe303e9c01208de9fc86db" UNIQUE ("hashId")`,
		)
		await queryRunner.query(
			`ALTER TABLE "tokens" ADD CONSTRAINT "UQ_d417e5d35f2434afc4bd48cb4d2" UNIQUE ("userId")`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients_categories" ADD CONSTRAINT "UQ_fd324a616c775a3c91913827805" UNIQUE ("name")`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients_categories_types" ADD CONSTRAINT "UQ_78435eb52c81e33bad0d205fe2d" UNIQUE ("name")`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_service_snapshot" ADD CONSTRAINT "UQ_af43508d964af303e3a20384e66" UNIQUE ("orderServiceId")`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_service_snapshot" ADD CONSTRAINT "UQ_7b50814eef706fae464738b25d6" UNIQUE ("orderAdditionalServicesId")`,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_986e7423fad4e9cf8411938356" ON "files" ("fullPath") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_f9baa59bb43bb65fe8b828f5db" ON "additional_enable_services" ("parentId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_99ee315cdaeb17b6b141efdbb3" ON "order_customer" ("userEmail") `,
		)
		await queryRunner.query(`CREATE INDEX "IDX_9afa1e5a9fd5f40df42fb04fe0" ON "services" ("type") `)
		await queryRunner.query(
			`CREATE INDEX "IDX_31f2f6cdc217456fc9d0378309" ON "services" ("clientId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_fc3677770c1663076076459846" ON "service_addresses" ("servicesId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_399234aa1c9e8cd072ee482001" ON "service_addresses" ("addressesId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_fcbcbda8635efb989627603a45" ON "service_parent_additional" ("servicesId_1") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_ec342b6bb5bc4999fad0975b22" ON "service_parent_additional" ("servicesId_2") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_12504db1f1263341845eca6947" ON "user_invite_roles_users_roles" ("userInviteId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_7c52de76f340fd1a18e7b65ffb" ON "user_invite_roles_users_roles" ("usersRolesId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_bb4617ba871ea2c44f9ef5a924" ON "user_invite_clients_clients" ("userInviteId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_159e5bd57878d37c75defba492" ON "user_invite_clients_clients" ("clientsId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_9898aa4885876d703d1d2323ba" ON "users_clients_clients" ("usersId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_8b3f1a5784e9bd6629afaeb02b" ON "users_clients_clients" ("clientsId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_8fd15f2fad60c321493261e5dd" ON "users_roles_users_roles" ("usersId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_9bc783228c35bac4836885e175" ON "users_roles_users_roles" ("usersRolesId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_962147211a44aab12ebfc8c15e" ON "additional_service_addresses_addresses" ("additionalServiceId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_77c32b28c583379bc65555c5dd" ON "additional_service_addresses_addresses" ("addressesId") `,
		)
		await queryRunner.query(
			`ALTER TABLE "users" ADD CONSTRAINT "user email and phone" UNIQUE ("userEmail", "phone")`,
		)
		await queryRunner.query(
			`ALTER TABLE "addresses_working_time" ADD CONSTRAINT "FK_6599d29ea706ca66ee88957e5b6" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "files" ADD CONSTRAINT "FK_63a9da42666b576b5ea6d53023b" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "files" ADD CONSTRAINT "FK_3dc4c61c64d2d9eb0705b4d89da" FOREIGN KEY ("servicesId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "files" ADD CONSTRAINT "FK_80f47d2852717045f2a4ffc0613" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "files" ADD CONSTRAINT "FK_7e7425b17f9e707331e9a6c7335" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "additional_enable_services" ADD CONSTRAINT "FK_f9baa59bb43bb65fe8b828f5db8" FOREIGN KEY ("parentId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_additional_service" ADD CONSTRAINT "FK_4f8bc182ea0849dc439578f1051" FOREIGN KEY ("orderServiceId") REFERENCES "order_service"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_free_additional_service" ADD CONSTRAINT "FK_d65c7d7f279287f4dae4f505009" FOREIGN KEY ("orderServiceId") REFERENCES "order_service"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "payments" ADD CONSTRAINT "FK_af929a5f2a400fdb6913b4967e1" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "orders" ADD CONSTRAINT "FK_e5de51ca888d8b1f5ac25799dd1" FOREIGN KEY ("customerId") REFERENCES "order_customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "orders" ADD CONSTRAINT "FK_37636d260931dcf46d11892f614" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "orders" ADD CONSTRAINT "FK_1457f286d91f271313fded23e53" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_service" ADD CONSTRAINT "FK_91eb72f17a0a7e3ddd52d182e80" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_service" ADD CONSTRAINT "FK_bba9910ede615896248e721f2fa" FOREIGN KEY ("targetId") REFERENCES "services_target"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "services_target" ADD CONSTRAINT "FK_8beff14a6160350005dfe321566" FOREIGN KEY ("servicesId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "services" ADD CONSTRAINT "FK_31f2f6cdc217456fc9d0378309d" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "services" ADD CONSTRAINT "FK_034b52310c2d211bc979c3cc4e8" FOREIGN KEY ("categoryId") REFERENCES "service_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "addresses" ADD CONSTRAINT "FK_ae1b6a2290ac79ac41dff9aa574" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients_payments_settings_methods_meta" ADD CONSTRAINT "FK_4c69c06482b3f0b02350bcea96b" FOREIGN KEY ("methodId") REFERENCES "client_payments_settings_methods"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "client_payments_settings_methods" ADD CONSTRAINT "FK_b2cbaf1b95a0f418d053283e859" FOREIGN KEY ("paymentSettingsId") REFERENCES "client_payments_settings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "notifications" ADD CONSTRAINT "FK_b760535ce3bbf06a8dc446c908f" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "client_integration" ADD CONSTRAINT "FK_22744b60e362a8c23a292eed50b" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients" ADD CONSTRAINT "FK_2867166616036e0059b79816551" FOREIGN KEY ("usersInviteId") REFERENCES "user_invite"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients" ADD CONSTRAINT "FK_17c0b2073ebd7875388fa98ab19" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients" ADD CONSTRAINT "FK_ef6b5dfa4df1560fd0fea7e952f" FOREIGN KEY ("paymentId") REFERENCES "client_payments_settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients" ADD CONSTRAINT "FK_f1d6695b088da25ec36e8916f22" FOREIGN KEY ("merchantDataId") REFERENCES "client_merchant_data"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_schedules" ADD CONSTRAINT "FK_07f6b47bf0635a55438926ec738" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_photo" ADD CONSTRAINT "FK_77339e3aeba9f696ce9fbbfebb1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_card" ADD CONSTRAINT "FK_1655200290938225906506337fa" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "recurrent" ADD CONSTRAINT "FK_8df17a6a2e393406bcd4548ad67" FOREIGN KEY ("rateId") REFERENCES "rate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_hashs" ADD CONSTRAINT "FK_c2e016a80b172789989251a69a2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "users" ADD CONSTRAINT "FK_a1dd4b2ac8cbaf5d11503bac653" FOREIGN KEY ("recurrentId") REFERENCES "recurrent"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "users" ADD CONSTRAINT "FK_125b0fe303e9c01208de9fc86db" FOREIGN KEY ("hashId") REFERENCES "users_hashs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "tokens" ADD CONSTRAINT "FK_d417e5d35f2434afc4bd48cb4d2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients_categories_types" ADD CONSTRAINT "FK_05d27878f8479ae124fdf03851f" FOREIGN KEY ("categoryId") REFERENCES "clients_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients_meta" ADD CONSTRAINT "FK_08f7cd62abe7302a0a8bac2392b" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_service_snapshot" ADD CONSTRAINT "FK_af43508d964af303e3a20384e66" FOREIGN KEY ("orderServiceId") REFERENCES "order_service"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_service_snapshot" ADD CONSTRAINT "FK_7b50814eef706fae464738b25d6" FOREIGN KEY ("orderAdditionalServicesId") REFERENCES "order_additional_service"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "additional_service" ADD CONSTRAINT "FK_23126662941e5916c42647e09fb" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "additional_service" ADD CONSTRAINT "FK_58f7de0962c743e25e51b29aa20" FOREIGN KEY ("prepaymentParamsId") REFERENCES "service_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_meta" ADD CONSTRAINT "FK_32ba3a637a983f931f5a98ec722" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "service_addresses" ADD CONSTRAINT "FK_fc3677770c1663076076459846d" FOREIGN KEY ("servicesId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "service_addresses" ADD CONSTRAINT "FK_399234aa1c9e8cd072ee482001e" FOREIGN KEY ("addressesId") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "service_parent_additional" ADD CONSTRAINT "FK_fcbcbda8635efb989627603a45e" FOREIGN KEY ("servicesId_1") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "service_parent_additional" ADD CONSTRAINT "FK_ec342b6bb5bc4999fad0975b229" FOREIGN KEY ("servicesId_2") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_invite_roles_users_roles" ADD CONSTRAINT "FK_12504db1f1263341845eca69474" FOREIGN KEY ("userInviteId") REFERENCES "user_invite"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_invite_roles_users_roles" ADD CONSTRAINT "FK_7c52de76f340fd1a18e7b65ffb6" FOREIGN KEY ("usersRolesId") REFERENCES "users_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_invite_clients_clients" ADD CONSTRAINT "FK_bb4617ba871ea2c44f9ef5a9249" FOREIGN KEY ("userInviteId") REFERENCES "user_invite"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_invite_clients_clients" ADD CONSTRAINT "FK_159e5bd57878d37c75defba492e" FOREIGN KEY ("clientsId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_clients_clients" ADD CONSTRAINT "FK_9898aa4885876d703d1d2323ba7" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_clients_clients" ADD CONSTRAINT "FK_8b3f1a5784e9bd6629afaeb02b1" FOREIGN KEY ("clientsId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_roles_users_roles" ADD CONSTRAINT "FK_8fd15f2fad60c321493261e5ddb" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_roles_users_roles" ADD CONSTRAINT "FK_9bc783228c35bac4836885e1754" FOREIGN KEY ("usersRolesId") REFERENCES "users_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "additional_service_addresses_addresses" ADD CONSTRAINT "FK_962147211a44aab12ebfc8c15e2" FOREIGN KEY ("additionalServiceId") REFERENCES "additional_service"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "additional_service_addresses_addresses" ADD CONSTRAINT "FK_77c32b28c583379bc65555c5dd5" FOREIGN KEY ("addressesId") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "additional_service_addresses_addresses" DROP CONSTRAINT "FK_77c32b28c583379bc65555c5dd5"`,
		)
		await queryRunner.query(
			`ALTER TABLE "additional_service_addresses_addresses" DROP CONSTRAINT "FK_962147211a44aab12ebfc8c15e2"`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_roles_users_roles" DROP CONSTRAINT "FK_9bc783228c35bac4836885e1754"`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_roles_users_roles" DROP CONSTRAINT "FK_8fd15f2fad60c321493261e5ddb"`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_clients_clients" DROP CONSTRAINT "FK_8b3f1a5784e9bd6629afaeb02b1"`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_clients_clients" DROP CONSTRAINT "FK_9898aa4885876d703d1d2323ba7"`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_invite_clients_clients" DROP CONSTRAINT "FK_159e5bd57878d37c75defba492e"`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_invite_clients_clients" DROP CONSTRAINT "FK_bb4617ba871ea2c44f9ef5a9249"`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_invite_roles_users_roles" DROP CONSTRAINT "FK_7c52de76f340fd1a18e7b65ffb6"`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_invite_roles_users_roles" DROP CONSTRAINT "FK_12504db1f1263341845eca69474"`,
		)
		await queryRunner.query(
			`ALTER TABLE "service_parent_additional" DROP CONSTRAINT "FK_ec342b6bb5bc4999fad0975b229"`,
		)
		await queryRunner.query(
			`ALTER TABLE "service_parent_additional" DROP CONSTRAINT "FK_fcbcbda8635efb989627603a45e"`,
		)
		await queryRunner.query(
			`ALTER TABLE "service_addresses" DROP CONSTRAINT "FK_399234aa1c9e8cd072ee482001e"`,
		)
		await queryRunner.query(
			`ALTER TABLE "service_addresses" DROP CONSTRAINT "FK_fc3677770c1663076076459846d"`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_meta" DROP CONSTRAINT "FK_32ba3a637a983f931f5a98ec722"`,
		)
		await queryRunner.query(
			`ALTER TABLE "additional_service" DROP CONSTRAINT "FK_58f7de0962c743e25e51b29aa20"`,
		)
		await queryRunner.query(
			`ALTER TABLE "additional_service" DROP CONSTRAINT "FK_23126662941e5916c42647e09fb"`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_service_snapshot" DROP CONSTRAINT "FK_7b50814eef706fae464738b25d6"`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_service_snapshot" DROP CONSTRAINT "FK_af43508d964af303e3a20384e66"`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients_meta" DROP CONSTRAINT "FK_08f7cd62abe7302a0a8bac2392b"`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients_categories_types" DROP CONSTRAINT "FK_05d27878f8479ae124fdf03851f"`,
		)
		await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_d417e5d35f2434afc4bd48cb4d2"`)
		await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_125b0fe303e9c01208de9fc86db"`)
		await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a1dd4b2ac8cbaf5d11503bac653"`)
		await queryRunner.query(
			`ALTER TABLE "users_hashs" DROP CONSTRAINT "FK_c2e016a80b172789989251a69a2"`,
		)
		await queryRunner.query(
			`ALTER TABLE "recurrent" DROP CONSTRAINT "FK_8df17a6a2e393406bcd4548ad67"`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_card" DROP CONSTRAINT "FK_1655200290938225906506337fa"`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_photo" DROP CONSTRAINT "FK_77339e3aeba9f696ce9fbbfebb1"`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_schedules" DROP CONSTRAINT "FK_07f6b47bf0635a55438926ec738"`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients" DROP CONSTRAINT "FK_f1d6695b088da25ec36e8916f22"`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients" DROP CONSTRAINT "FK_ef6b5dfa4df1560fd0fea7e952f"`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients" DROP CONSTRAINT "FK_17c0b2073ebd7875388fa98ab19"`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients" DROP CONSTRAINT "FK_2867166616036e0059b79816551"`,
		)
		await queryRunner.query(
			`ALTER TABLE "client_integration" DROP CONSTRAINT "FK_22744b60e362a8c23a292eed50b"`,
		)
		await queryRunner.query(
			`ALTER TABLE "notifications" DROP CONSTRAINT "FK_b760535ce3bbf06a8dc446c908f"`,
		)
		await queryRunner.query(
			`ALTER TABLE "client_payments_settings_methods" DROP CONSTRAINT "FK_b2cbaf1b95a0f418d053283e859"`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients_payments_settings_methods_meta" DROP CONSTRAINT "FK_4c69c06482b3f0b02350bcea96b"`,
		)
		await queryRunner.query(
			`ALTER TABLE "addresses" DROP CONSTRAINT "FK_ae1b6a2290ac79ac41dff9aa574"`,
		)
		await queryRunner.query(
			`ALTER TABLE "services" DROP CONSTRAINT "FK_034b52310c2d211bc979c3cc4e8"`,
		)
		await queryRunner.query(
			`ALTER TABLE "services" DROP CONSTRAINT "FK_31f2f6cdc217456fc9d0378309d"`,
		)
		await queryRunner.query(
			`ALTER TABLE "services_target" DROP CONSTRAINT "FK_8beff14a6160350005dfe321566"`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_service" DROP CONSTRAINT "FK_bba9910ede615896248e721f2fa"`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_service" DROP CONSTRAINT "FK_91eb72f17a0a7e3ddd52d182e80"`,
		)
		await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_1457f286d91f271313fded23e53"`)
		await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_37636d260931dcf46d11892f614"`)
		await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_e5de51ca888d8b1f5ac25799dd1"`)
		await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`)
		await queryRunner.query(
			`ALTER TABLE "payments" DROP CONSTRAINT "FK_af929a5f2a400fdb6913b4967e1"`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_free_additional_service" DROP CONSTRAINT "FK_d65c7d7f279287f4dae4f505009"`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_additional_service" DROP CONSTRAINT "FK_4f8bc182ea0849dc439578f1051"`,
		)
		await queryRunner.query(
			`ALTER TABLE "additional_enable_services" DROP CONSTRAINT "FK_f9baa59bb43bb65fe8b828f5db8"`,
		)
		await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_7e7425b17f9e707331e9a6c7335"`)
		await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_80f47d2852717045f2a4ffc0613"`)
		await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_3dc4c61c64d2d9eb0705b4d89da"`)
		await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_63a9da42666b576b5ea6d53023b"`)
		await queryRunner.query(
			`ALTER TABLE "addresses_working_time" DROP CONSTRAINT "FK_6599d29ea706ca66ee88957e5b6"`,
		)
		await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "user email and phone"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_77c32b28c583379bc65555c5dd"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_962147211a44aab12ebfc8c15e"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_9bc783228c35bac4836885e175"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_8fd15f2fad60c321493261e5dd"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_8b3f1a5784e9bd6629afaeb02b"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_9898aa4885876d703d1d2323ba"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_159e5bd57878d37c75defba492"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_bb4617ba871ea2c44f9ef5a924"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_7c52de76f340fd1a18e7b65ffb"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_12504db1f1263341845eca6947"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_ec342b6bb5bc4999fad0975b22"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_fcbcbda8635efb989627603a45"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_399234aa1c9e8cd072ee482001"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_fc3677770c1663076076459846"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_31f2f6cdc217456fc9d0378309"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_9afa1e5a9fd5f40df42fb04fe0"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_99ee315cdaeb17b6b141efdbb3"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_f9baa59bb43bb65fe8b828f5db"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_986e7423fad4e9cf8411938356"`)
		await queryRunner.query(
			`ALTER TABLE "order_service_snapshot" DROP CONSTRAINT "UQ_7b50814eef706fae464738b25d6"`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_service_snapshot" DROP CONSTRAINT "UQ_af43508d964af303e3a20384e66"`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients_categories_types" DROP CONSTRAINT "UQ_78435eb52c81e33bad0d205fe2d"`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients_categories" DROP CONSTRAINT "UQ_fd324a616c775a3c91913827805"`,
		)
		await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "UQ_d417e5d35f2434afc4bd48cb4d2"`)
		await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_125b0fe303e9c01208de9fc86db"`)
		await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_a1dd4b2ac8cbaf5d11503bac653"`)
		await queryRunner.query(
			`ALTER TABLE "users_hashs" DROP CONSTRAINT "UQ_c2e016a80b172789989251a69a2"`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients" DROP CONSTRAINT "UQ_f1d6695b088da25ec36e8916f22"`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients" DROP CONSTRAINT "UQ_ef6b5dfa4df1560fd0fea7e952f"`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients" DROP CONSTRAINT "UQ_65cc60df913867ccb2c5f3d0776"`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_invite" DROP CONSTRAINT "UQ_caa2eb015b7b008d71dfb27674b"`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_invite" DROP CONSTRAINT "UQ_4782feb92faa0e0a1ce81afb462"`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_customer" DROP CONSTRAINT "UQ_99ee315cdaeb17b6b141efdbb39"`,
		)
		await queryRunner.query(
			`ALTER TABLE "additional_service_addresses_addresses" ADD CONSTRAINT "additional_service_addresses_addresses_addressesId_fkey" FOREIGN KEY ("addressesId") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "additional_service_addresses_addresses" ADD CONSTRAINT "additional_service_addresses_addresses_additionalServiceId_fkey" FOREIGN KEY ("additionalServiceId") REFERENCES "additional_service"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_roles_users_roles" ADD CONSTRAINT "users_roles_users_roles_usersRolesId_fkey" FOREIGN KEY ("usersRolesId") REFERENCES "users_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_roles_users_roles" ADD CONSTRAINT "users_roles_users_roles_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_clients_clients" ADD CONSTRAINT "users_clients_clients_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_clients_clients" ADD CONSTRAINT "users_clients_clients_clientsId_fkey" FOREIGN KEY ("clientsId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_invite_clients_clients" ADD CONSTRAINT "user_invite_clients_clients_userInviteId_fkey" FOREIGN KEY ("userInviteId") REFERENCES "user_invite"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_invite_clients_clients" ADD CONSTRAINT "user_invite_clients_clients_clientsId_fkey" FOREIGN KEY ("clientsId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_invite_roles_users_roles" ADD CONSTRAINT "user_invite_roles_users_roles_userInviteId_fkey" FOREIGN KEY ("userInviteId") REFERENCES "user_invite"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_invite_roles_users_roles" ADD CONSTRAINT "user_invite_roles_users_roles_usersRolesId_fkey" FOREIGN KEY ("usersRolesId") REFERENCES "users_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "service_parent_additional" ADD CONSTRAINT "service_parent_additional_servicesId_1_fkey" FOREIGN KEY ("servicesId_1") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "service_parent_additional" ADD CONSTRAINT "service_parent_additional_servicesId_2_fkey" FOREIGN KEY ("servicesId_2") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "service_addresses" ADD CONSTRAINT "service_addresses_addressesId_fkey" FOREIGN KEY ("addressesId") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "service_addresses" ADD CONSTRAINT "service_addresses_servicesId_fkey" FOREIGN KEY ("servicesId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_meta" ADD CONSTRAINT "users_meta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "additional_service" ADD CONSTRAINT "additional_service_prepaymentParamsId_fkey" FOREIGN KEY ("prepaymentParamsId") REFERENCES "service_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "additional_service" ADD CONSTRAINT "additional_service_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_service_snapshot" ADD CONSTRAINT "order_service_snapshot_orderAdditionalServicesId_fkey" FOREIGN KEY ("orderAdditionalServicesId") REFERENCES "order_additional_service"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_service_snapshot" ADD CONSTRAINT "order_service_snapshot_orderServiceId_fkey" FOREIGN KEY ("orderServiceId") REFERENCES "order_service"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients_meta" ADD CONSTRAINT "clients_meta_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients_categories_types" ADD CONSTRAINT "clients_categories_types_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "clients_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "tokens" ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "users" ADD CONSTRAINT "users_hashId_fkey" FOREIGN KEY ("hashId") REFERENCES "users_hashs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "users" ADD CONSTRAINT "users_recurrentId_fkey" FOREIGN KEY ("recurrentId") REFERENCES "recurrent"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_hashs" ADD CONSTRAINT "users_hashs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "recurrent" ADD CONSTRAINT "recurrent_rateId_fkey" FOREIGN KEY ("rateId") REFERENCES "rate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_card" ADD CONSTRAINT "users_card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "users_photo" ADD CONSTRAINT "users_photo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "user_schedules" ADD CONSTRAINT "user_schedules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients" ADD CONSTRAINT "clients_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "client_payments_settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients" ADD CONSTRAINT "clients_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients" ADD CONSTRAINT "clients_merchantDataId_fkey" FOREIGN KEY ("merchantDataId") REFERENCES "client_merchant_data"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients" ADD CONSTRAINT "clients_usersInviteId_fkey" FOREIGN KEY ("usersInviteId") REFERENCES "user_invite"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "client_integration" ADD CONSTRAINT "client_integration_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "notifications" ADD CONSTRAINT "notifications_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "client_payments_settings_methods" ADD CONSTRAINT "client_payments_settings_methods_paymentSettingsId_fkey" FOREIGN KEY ("paymentSettingsId") REFERENCES "client_payments_settings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "clients_payments_settings_methods_meta" ADD CONSTRAINT "clients_payments_settings_methods_meta_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "client_payments_settings_methods"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "addresses" ADD CONSTRAINT "addresses_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "services" ADD CONSTRAINT "services_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "service_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "services" ADD CONSTRAINT "services_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "services_target" ADD CONSTRAINT "services_target_servicesId_fkey" FOREIGN KEY ("servicesId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_service" ADD CONSTRAINT "order_service_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_service" ADD CONSTRAINT "order_service_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "services_target"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "order_customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "orders" ADD CONSTRAINT "orders_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "orders" ADD CONSTRAINT "orders_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_free_additional_service" ADD CONSTRAINT "order_free_additional_service_orderServiceId_fkey" FOREIGN KEY ("orderServiceId") REFERENCES "order_service"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "order_additional_service" ADD CONSTRAINT "order_additional_service_orderServiceId_fkey" FOREIGN KEY ("orderServiceId") REFERENCES "order_service"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "additional_enable_services" ADD CONSTRAINT "additional_enable_services_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		)
		await queryRunner.query(
			`ALTER TABLE "files" ADD CONSTRAINT "files_servicesId_fkey" FOREIGN KEY ("servicesId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "files" ADD CONSTRAINT "files_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "files" ADD CONSTRAINT "files_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "files" ADD CONSTRAINT "files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "addresses_working_time" ADD CONSTRAINT "addresses_working_time_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
	}
}
