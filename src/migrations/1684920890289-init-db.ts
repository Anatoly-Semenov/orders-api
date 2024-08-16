import { MigrationInterface, QueryRunner } from 'typeorm'

export class initDb1684920890289 implements MigrationInterface {
	name = 'initDb1684920890289'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "addresses_working_time" ("id" SERIAL NOT NULL, "day" json NOT NULL DEFAULT '[]', "options" json NOT NULL DEFAULT '[]', "timeStart" character varying NOT NULL, "timeEnd" character varying NOT NULL, "sortPosition" integer NOT NULL DEFAULT '0', "addressId" integer, CONSTRAINT "PK_14e818815d9ce377965c380d75c" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "files" ("id" SERIAL NOT NULL, "fullPath" character varying NOT NULL, "tag" character varying NOT NULL DEFAULT 'photo', "host" character varying NOT NULL DEFAULT 'server', "sortPosition" integer NOT NULL DEFAULT '0', "mimetype" character varying NOT NULL DEFAULT '', "created" TIMESTAMP NOT NULL DEFAULT now(), "clientId" integer, "servicesId" integer, "addressId" integer, "userId" integer, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_986e7423fad4e9cf8411938356" ON "files" ("fullPath") `,
		)
		await queryRunner.query(
			`CREATE TABLE "service_categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_fe4da5476c4ffe5aa2d3524ae68" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "additional_enable_services" ("id" SERIAL NOT NULL, "isEnable" boolean NOT NULL DEFAULT false, "isRequire" boolean NOT NULL DEFAULT false, "customerCanView" boolean NOT NULL DEFAULT false, "childrenId" integer, "parentId" integer, CONSTRAINT "PK_2b5b94ae0e491440c909dc6c417" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_f9baa59bb43bb65fe8b828f5db" ON "additional_enable_services" ("parentId") `,
		)
		await queryRunner.query(
			`CREATE TABLE "order_additional_service" ("id" SERIAL NOT NULL, "title" character varying NOT NULL DEFAULT '', "additionalType" character varying NOT NULL DEFAULT '', "paymentTypes" character varying NOT NULL DEFAULT '', "duration" integer NOT NULL DEFAULT '0', "count" integer DEFAULT '0', "price" numeric NOT NULL DEFAULT '0', "service" jsonb NOT NULL DEFAULT '{}', "orderServiceId" integer, CONSTRAINT "PK_91cf74723d180b6025db5c6cb58" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "order_free_additional_service" ("id" SERIAL NOT NULL, "title" character varying NOT NULL DEFAULT '', "additionalType" character varying NOT NULL DEFAULT '', "paymentTypes" character varying NOT NULL DEFAULT '', "duration" integer NOT NULL DEFAULT '0', "count" integer DEFAULT '0', "price" numeric NOT NULL DEFAULT '0', "service" jsonb NOT NULL DEFAULT '{}', "orderServiceId" integer, CONSTRAINT "PK_06779431d3a7f51cd0d0dc0c098" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "order_customer" ("id" SERIAL NOT NULL, "userEmail" character varying NOT NULL, "language" character varying NOT NULL DEFAULT 'ru-RU', "phone" character varying NOT NULL DEFAULT '', "phoneIso" character varying NOT NULL DEFAULT '', "meta" json DEFAULT '{}', CONSTRAINT "UQ_99ee315cdaeb17b6b141efdbb39" UNIQUE ("userEmail"), CONSTRAINT "PK_cd7812c96209c5bdd48a6b858b0" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_99ee315cdaeb17b6b141efdbb3" ON "order_customer" ("userEmail") `,
		)
		await queryRunner.query(
			`CREATE TABLE "payments" ("id" SERIAL NOT NULL, "amount" numeric NOT NULL DEFAULT '0', "currency" character varying NOT NULL DEFAULT 'rub', "language" character varying NOT NULL DEFAULT 'ru', "status" character varying NOT NULL DEFAULT 'notPaid', "provider" character varying NOT NULL DEFAULT 'tinkoff', "providerPaymentId" character varying NOT NULL DEFAULT '', "providerPaymentURL" character varying NOT NULL DEFAULT '', "providerPaymentDetails" character varying NOT NULL DEFAULT '', "providerPaymentStatusCode" character varying NOT NULL DEFAULT '', "providerPaymentStatusComment" character varying NOT NULL DEFAULT '', "providerPaymentErrorCode" character varying NOT NULL DEFAULT '', "isFree" boolean NOT NULL DEFAULT false, "createFirstPaymentInBank" boolean NOT NULL DEFAULT true, "providerPaymentMethod" character varying NOT NULL DEFAULT 'prepayment', "method" character varying NOT NULL DEFAULT 'other', "type" character varying NOT NULL DEFAULT 'prepayment', "created" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "orderId" integer, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "comment" character varying(500) NOT NULL DEFAULT '', "price" numeric NOT NULL DEFAULT '2400', "orderSource" character varying NOT NULL DEFAULT 'subclient', "sale" integer NOT NULL DEFAULT '0', "saleType" character varying NOT NULL DEFAULT 'percent', "isTechnicalReservation" boolean NOT NULL DEFAULT false, "status" character varying DEFAULT 'created', "amount" integer NOT NULL DEFAULT '0', "currency" character varying NOT NULL DEFAULT 'rub', "paymentStatus" character varying NOT NULL DEFAULT 'withoutPayment', "discount" integer NOT NULL DEFAULT '0', "datetimezone" character varying NOT NULL DEFAULT 'Europe/Moscow', "allowNotifications" boolean NOT NULL DEFAULT true, "discountType" character varying NOT NULL DEFAULT '', "duration" integer NOT NULL DEFAULT '0', "isCompleted" boolean NOT NULL DEFAULT false, "dateTimeStart" TIMESTAMP NOT NULL DEFAULT now(), "dateTimeEnd" TIMESTAMP NOT NULL DEFAULT now(), "createFirstPaymentInBank" boolean NOT NULL DEFAULT false, "created" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "userId" integer, "customerId" integer, "addressId" integer, "clientId" integer, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "order_service" ("id" SERIAL NOT NULL, "title" character varying NOT NULL DEFAULT '', "price" numeric NOT NULL DEFAULT '0', "type" character varying NOT NULL DEFAULT '', "seatsAmount" integer NOT NULL DEFAULT '0', "count" integer NOT NULL DEFAULT '0', "service" jsonb NOT NULL DEFAULT '[]', "orderId" integer, "targetId" integer, CONSTRAINT "PK_d33d62cc4f08f6bd10dd7a68f65" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "services_target" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "servicePriceSettings" json, "servicesId" integer, CONSTRAINT "PK_d44f4233e0075b167c9b5976b60" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "services" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying(1000) NOT NULL DEFAULT '', "components" json, "type" character varying NOT NULL DEFAULT 'rent', "price" numeric, "additionalType" character varying DEFAULT 'requisite', "paymentType" character varying, "paymentAmount" numeric, "format" character varying NOT NULL DEFAULT '', "blockBookingType" character varying NOT NULL DEFAULT 'min', "minTimeLength" integer NOT NULL DEFAULT '0', "timeLength" integer NOT NULL DEFAULT '0', "break" integer NOT NULL DEFAULT '0', "blockBookingIsEnable" boolean NOT NULL DEFAULT false, "blockBookingTime" integer NOT NULL DEFAULT '0', "amountPeopleMin" integer NOT NULL DEFAULT '0', "amountPeopleMax" integer NOT NULL DEFAULT '0', "seats" integer NOT NULL DEFAULT '1', "includedSeats" integer NOT NULL DEFAULT '1', "additionalSeatsIsEnable" boolean NOT NULL DEFAULT false, "additionalSeats" integer NOT NULL DEFAULT '0', "copyVersion" integer NOT NULL DEFAULT '1', "additionalSeatsPaymentType" character varying NOT NULL DEFAULT '', "additionalSeatsAmount" integer NOT NULL DEFAULT '0', "prepayment" character varying NOT NULL DEFAULT 'main', "duration" integer NOT NULL DEFAULT '0', "prepaymentAmount" integer NOT NULL DEFAULT '0', "isValid" boolean NOT NULL DEFAULT true, "prepaymentType" character varying NOT NULL DEFAULT 'amount', "customerCanView" boolean NOT NULL DEFAULT false, "sortPosition" integer NOT NULL DEFAULT '0', "isEnable" boolean NOT NULL DEFAULT false, "breakIsEnable" boolean NOT NULL DEFAULT false, "isDeleted" boolean NOT NULL DEFAULT false, "isRequire" boolean NOT NULL DEFAULT false, "created" TIMESTAMP NOT NULL DEFAULT now(), "priceSettings" json, "prepaymentParams" json, "clientId" integer, "categoryId" integer, CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(`CREATE INDEX "IDX_9afa1e5a9fd5f40df42fb04fe0" ON "services" ("type") `)
		await queryRunner.query(
			`CREATE INDEX "IDX_31f2f6cdc217456fc9d0378309" ON "services" ("clientId") `,
		)
		await queryRunner.query(
			`CREATE TABLE "addresses" ("id" SERIAL NOT NULL, "country" character varying NOT NULL, "countryIsoCode" character varying NOT NULL, "postalCode" character varying NOT NULL DEFAULT '', "house" integer, "block" character varying, "floor" integer, "office" character varying NOT NULL DEFAULT '', "geoLat" integer, "geoLon" integer, "city" character varying NOT NULL, "street" character varying NOT NULL DEFAULT '', "timezone" character varying NOT NULL DEFAULT 'Europe/Moscow', "isActive" boolean NOT NULL DEFAULT true, "isEnable" boolean NOT NULL DEFAULT true, "sortPosition" integer NOT NULL DEFAULT '0', "created" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, "clientId" integer, CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "clients_payments_settings_methods_meta" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "value" character varying NOT NULL, "methodId" integer, CONSTRAINT "PK_9f003ec8abfb7afc310b613b5c8" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "client_payments_settings_methods" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "paymentSettingsId" integer, CONSTRAINT "PK_babd39c78fc6911cc630dfc422e" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "client_payments_settings" ("id" SERIAL NOT NULL, "expire" integer NOT NULL, "taxAccount" boolean NOT NULL DEFAULT false, "currency" character varying NOT NULL DEFAULT 'RUB', "isEnable" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_3356cec529725831180d4732f60" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "customText" character varying(200) NOT NULL, "type" character varying NOT NULL, "clientId" integer, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "client_merchant_data" ("id" SERIAL NOT NULL, "billingDescriptor" character varying NOT NULL, "fullName" character varying NOT NULL, "name" character varying NOT NULL, "inn" character varying NOT NULL, "kpp" character varying NOT NULL, "ogrn" character varying NOT NULL, "addresses" jsonb NOT NULL, "email" character varying NOT NULL, "siteUrl" character varying NOT NULL, "code" character varying NOT NULL DEFAULT '', "shopCode" character varying NOT NULL DEFAULT '', "terminals" jsonb NOT NULL DEFAULT '[]', "ceo" jsonb NOT NULL, "bankAccount" jsonb NOT NULL, "provider" character varying NOT NULL DEFAULT 'tinkoff', CONSTRAINT "PK_0870090ad270711afb70e70a40a" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "client_integration" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "value" jsonb NOT NULL, "clientId" integer, CONSTRAINT "PK_cdba79882ebc79784ac6aaf6370" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "users_roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_1d8dd7ffa37c3ab0c4eefb0b221" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "user_invite" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "hash" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_4782feb92faa0e0a1ce81afb462" UNIQUE ("email"), CONSTRAINT "UQ_caa2eb015b7b008d71dfb27674b" UNIQUE ("hash"), CONSTRAINT "PK_8108c55aa759aab27050cc06607" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "clients" ("id" SERIAL NOT NULL, "idAlias" character varying NOT NULL, "clientName" character varying NOT NULL, "clientDescription" character varying(200) NOT NULL DEFAULT '', "clientUrl" character varying NOT NULL, "secretKey" character varying NOT NULL, "testSecretKey" character varying NOT NULL, "isEnable" boolean NOT NULL DEFAULT false, "isTest" boolean NOT NULL DEFAULT false, "timezone" character varying NOT NULL DEFAULT 'Europe/Moscow', "copyVersion" integer NOT NULL DEFAULT '1', "calendarTimeStep" integer NOT NULL DEFAULT '60', "currency" character varying NOT NULL DEFAULT 'rub', "created" TIMESTAMP NOT NULL DEFAULT now(), "paymentLinkSeconds" integer NOT NULL DEFAULT '86400', "meta" json DEFAULT '{}', "usersInviteId" integer, "ownerId" integer, "paymentId" integer, "merchantDataId" integer, CONSTRAINT "UQ_65cc60df913867ccb2c5f3d0776" UNIQUE ("idAlias"), CONSTRAINT "REL_ef6b5dfa4df1560fd0fea7e952" UNIQUE ("paymentId"), CONSTRAINT "REL_f1d6695b088da25ec36e8916f2" UNIQUE ("merchantDataId"), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "user_schedules" ("id" SERIAL NOT NULL, "dateTimeStart" TIMESTAMP NOT NULL, "dateTimeEnd" TIMESTAMP NOT NULL, "timezone" character varying NOT NULL DEFAULT 'Europe/Moscow', "isEnable" boolean NOT NULL DEFAULT true, "userId" integer, CONSTRAINT "PK_6481357d75d7a163986d89a6a74" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "users_photo" ("id" SERIAL NOT NULL, "path" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_c15c1640c422bdab41e44a19d86" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "users_card" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "firstNumbers" character varying NOT NULL, "lastNumbers" character varying NOT NULL, "bank" character varying NOT NULL, "cardType" character varying NOT NULL, "cardExpDate" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_2d3274032fbfa1e9de14a3ccd4d" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "rate" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "amount" integer NOT NULL, "saleAmount" integer NOT NULL, CONSTRAINT "PK_2618d0d38af322d152ccc328f33" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "recurrent" ("id" SERIAL NOT NULL, "expire" TIMESTAMP NOT NULL, "recurrentId" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'active', "rateId" integer, CONSTRAINT "PK_0c16a5b2cb09496157726b011e5" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "users_hashs" ("id" SERIAL NOT NULL, "expire" integer NOT NULL, "hash" character varying, "userId" integer, CONSTRAINT "REL_c2e016a80b172789989251a69a" UNIQUE ("userId"), CONSTRAINT "PK_55fab8387c2889d0fd0031ce095" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "users" ("id" SERIAL NOT NULL, "userEmail" character varying NOT NULL, "userPassword" character varying NOT NULL, "language" character varying NOT NULL DEFAULT 'ru-RU', "phone" character varying NOT NULL DEFAULT '', "phoneIso" character varying NOT NULL DEFAULT '', "isEnable" boolean NOT NULL DEFAULT false, "meta" json DEFAULT '{}', "recurrentId" integer, "hashId" integer, CONSTRAINT "user email and phone" UNIQUE ("userEmail", "phone"), CONSTRAINT "REL_a1dd4b2ac8cbaf5d11503bac65" UNIQUE ("recurrentId"), CONSTRAINT "REL_125b0fe303e9c01208de9fc86d" UNIQUE ("hashId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "tokens" ("id" SERIAL NOT NULL, "refreshToken" text NOT NULL, "userId" integer, CONSTRAINT "REL_d417e5d35f2434afc4bd48cb4d" UNIQUE ("userId"), CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "clients_categories_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "isEnable" boolean NOT NULL DEFAULT true, "categoryId" integer, CONSTRAINT "UQ_78435eb52c81e33bad0d205fe2d" UNIQUE ("name"), CONSTRAINT "PK_f2e063760f1f122171e42d9c15c" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "clients_categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "isEnable" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_fd324a616c775a3c91913827805" UNIQUE ("name"), CONSTRAINT "PK_aa527b089151450699fa6eb60fe" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "clients_meta" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "value" character varying NOT NULL, "clientId" integer, CONSTRAINT "PK_53f4f988bd2c5eaefba4c84d069" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "order_tech" ("id" SERIAL NOT NULL, "isTechnicalReservation" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_9e43cdc0a970e43c3a703551cf7" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "order_service_snapshot" ("id" SERIAL NOT NULL, "snapshot" jsonb NOT NULL, "orderServiceId" integer, "orderAdditionalServicesId" integer, CONSTRAINT "REL_af43508d964af303e3a20384e6" UNIQUE ("orderServiceId"), CONSTRAINT "REL_7b50814eef706fae464738b25d" UNIQUE ("orderAdditionalServicesId"), CONSTRAINT "PK_3e2dc940c3252b749140ce10e60" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "additional_service" ("id" SERIAL NOT NULL, "title" character varying, "description" character varying(200) NOT NULL DEFAULT '', "components" json, "type" character varying NOT NULL DEFAULT 'rent', "format" character varying NOT NULL DEFAULT '', "blockBookingType" character varying NOT NULL DEFAULT 'min', "minTimeLength" integer NOT NULL DEFAULT '0', "timeLength" integer NOT NULL DEFAULT '0', "break" integer NOT NULL DEFAULT '0', "blockBookingIsEnable" boolean NOT NULL DEFAULT false, "blockBookingTime" integer NOT NULL DEFAULT '0', "amountPeopleMin" integer NOT NULL DEFAULT '0', "amountPeopleMax" integer NOT NULL DEFAULT '0', "seats" integer NOT NULL DEFAULT '1', "includedSeats" integer NOT NULL DEFAULT '1', "additionalSeatsIsEnable" boolean NOT NULL DEFAULT false, "additionalType" character varying NOT NULL DEFAULT 'requisite', "additionalSeats" integer NOT NULL DEFAULT '0', "copyVersion" integer NOT NULL DEFAULT '1', "additionalSeatsPaymentType" character varying NOT NULL DEFAULT '', "additionalSeatsAmount" integer NOT NULL DEFAULT '0', "prepayment" character varying NOT NULL DEFAULT 'main', "duration" integer NOT NULL DEFAULT '0', "prepaymentAmount" integer NOT NULL DEFAULT '0', "paymentAmount" integer NOT NULL DEFAULT '0', "isValid" boolean NOT NULL DEFAULT true, "prepaymentType" character varying NOT NULL DEFAULT 'amount', "paymentType" character varying NOT NULL DEFAULT 'time', "customerCanView" boolean NOT NULL DEFAULT false, "sortPosition" integer NOT NULL DEFAULT '0', "price" integer NOT NULL DEFAULT '0', "isEnable" boolean NOT NULL DEFAULT false, "breakIsEnable" boolean NOT NULL DEFAULT false, "isDeleted" boolean NOT NULL DEFAULT false, "isRequire" boolean NOT NULL DEFAULT false, "created" TIMESTAMP NOT NULL DEFAULT now(), "prepaymentParams" json, "clientId" integer, "prepaymentParamsId" integer, CONSTRAINT "PK_e06cd186fc8527c947ca73fc209" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "users_candidate" ("id" SERIAL NOT NULL, "expire" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "phone" character varying NOT NULL DEFAULT '', "phoneIso" character varying NOT NULL DEFAULT '', "meta" json DEFAULT '{}', "email" character varying NOT NULL DEFAULT '', "password" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_a6edbe5a917f5a9bca9efe20a32" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "users_meta" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "value" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_db3591ffd4849630c37bb18d046" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "service_addresses" ("servicesId" integer NOT NULL, "addressesId" integer NOT NULL, CONSTRAINT "PK_d4f56d60df1a81128587d38e6f7" PRIMARY KEY ("servicesId", "addressesId"))`,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_fc3677770c1663076076459846" ON "service_addresses" ("servicesId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_399234aa1c9e8cd072ee482001" ON "service_addresses" ("addressesId") `,
		)
		await queryRunner.query(
			`CREATE TABLE "service_parent_additional" ("servicesId_1" integer NOT NULL, "servicesId_2" integer NOT NULL, CONSTRAINT "PK_3f24c2909e9f510d48cba874295" PRIMARY KEY ("servicesId_1", "servicesId_2"))`,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_fcbcbda8635efb989627603a45" ON "service_parent_additional" ("servicesId_1") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_ec342b6bb5bc4999fad0975b22" ON "service_parent_additional" ("servicesId_2") `,
		)
		await queryRunner.query(
			`CREATE TABLE "user_invite_roles_users_roles" ("userInviteId" integer NOT NULL, "usersRolesId" integer NOT NULL, CONSTRAINT "PK_ff08e7c79b80b42dc32540cfc72" PRIMARY KEY ("userInviteId", "usersRolesId"))`,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_12504db1f1263341845eca6947" ON "user_invite_roles_users_roles" ("userInviteId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_7c52de76f340fd1a18e7b65ffb" ON "user_invite_roles_users_roles" ("usersRolesId") `,
		)
		await queryRunner.query(
			`CREATE TABLE "user_invite_clients_clients" ("userInviteId" integer NOT NULL, "clientsId" integer NOT NULL, CONSTRAINT "PK_200e307dada1edccee60825e082" PRIMARY KEY ("userInviteId", "clientsId"))`,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_bb4617ba871ea2c44f9ef5a924" ON "user_invite_clients_clients" ("userInviteId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_159e5bd57878d37c75defba492" ON "user_invite_clients_clients" ("clientsId") `,
		)
		await queryRunner.query(
			`CREATE TABLE "users_clients_clients" ("usersId" integer NOT NULL, "clientsId" integer NOT NULL, CONSTRAINT "PK_79835a4a5b7c290c6a373d4b05c" PRIMARY KEY ("usersId", "clientsId"))`,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_9898aa4885876d703d1d2323ba" ON "users_clients_clients" ("usersId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_8b3f1a5784e9bd6629afaeb02b" ON "users_clients_clients" ("clientsId") `,
		)
		await queryRunner.query(
			`CREATE TABLE "users_roles_users_roles" ("usersId" integer NOT NULL, "usersRolesId" integer NOT NULL, CONSTRAINT "PK_f5dafbf7b1c697134507645cd8b" PRIMARY KEY ("usersId", "usersRolesId"))`,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_8fd15f2fad60c321493261e5dd" ON "users_roles_users_roles" ("usersId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_9bc783228c35bac4836885e175" ON "users_roles_users_roles" ("usersRolesId") `,
		)
		await queryRunner.query(
			`CREATE TABLE "additional_service_addresses_addresses" ("additionalServiceId" integer NOT NULL, "addressesId" integer NOT NULL, CONSTRAINT "PK_066fc34835b4bda445abdc8fb5a" PRIMARY KEY ("additionalServiceId", "addressesId"))`,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_962147211a44aab12ebfc8c15e" ON "additional_service_addresses_addresses" ("additionalServiceId") `,
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_77c32b28c583379bc65555c5dd" ON "additional_service_addresses_addresses" ("addressesId") `,
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
		await queryRunner.query(`DROP INDEX "public"."IDX_77c32b28c583379bc65555c5dd"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_962147211a44aab12ebfc8c15e"`)
		await queryRunner.query(`DROP TABLE "additional_service_addresses_addresses"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_9bc783228c35bac4836885e175"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_8fd15f2fad60c321493261e5dd"`)
		await queryRunner.query(`DROP TABLE "users_roles_users_roles"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_8b3f1a5784e9bd6629afaeb02b"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_9898aa4885876d703d1d2323ba"`)
		await queryRunner.query(`DROP TABLE "users_clients_clients"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_159e5bd57878d37c75defba492"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_bb4617ba871ea2c44f9ef5a924"`)
		await queryRunner.query(`DROP TABLE "user_invite_clients_clients"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_7c52de76f340fd1a18e7b65ffb"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_12504db1f1263341845eca6947"`)
		await queryRunner.query(`DROP TABLE "user_invite_roles_users_roles"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_ec342b6bb5bc4999fad0975b22"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_fcbcbda8635efb989627603a45"`)
		await queryRunner.query(`DROP TABLE "service_parent_additional"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_399234aa1c9e8cd072ee482001"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_fc3677770c1663076076459846"`)
		await queryRunner.query(`DROP TABLE "service_addresses"`)
		await queryRunner.query(`DROP TABLE "users_meta"`)
		await queryRunner.query(`DROP TABLE "users_candidate"`)
		await queryRunner.query(`DROP TABLE "additional_service"`)
		await queryRunner.query(`DROP TABLE "order_service_snapshot"`)
		await queryRunner.query(`DROP TABLE "order_tech"`)
		await queryRunner.query(`DROP TABLE "clients_meta"`)
		await queryRunner.query(`DROP TABLE "clients_categories"`)
		await queryRunner.query(`DROP TABLE "clients_categories_types"`)
		await queryRunner.query(`DROP TABLE "tokens"`)
		await queryRunner.query(`DROP TABLE "users"`)
		await queryRunner.query(`DROP TABLE "users_hashs"`)
		await queryRunner.query(`DROP TABLE "recurrent"`)
		await queryRunner.query(`DROP TABLE "rate"`)
		await queryRunner.query(`DROP TABLE "users_card"`)
		await queryRunner.query(`DROP TABLE "users_photo"`)
		await queryRunner.query(`DROP TABLE "user_schedules"`)
		await queryRunner.query(`DROP TABLE "clients"`)
		await queryRunner.query(`DROP TABLE "user_invite"`)
		await queryRunner.query(`DROP TABLE "users_roles"`)
		await queryRunner.query(`DROP TABLE "client_integration"`)
		await queryRunner.query(`DROP TABLE "client_merchant_data"`)
		await queryRunner.query(`DROP TABLE "notifications"`)
		await queryRunner.query(`DROP TABLE "client_payments_settings"`)
		await queryRunner.query(`DROP TABLE "client_payments_settings_methods"`)
		await queryRunner.query(`DROP TABLE "clients_payments_settings_methods_meta"`)
		await queryRunner.query(`DROP TABLE "addresses"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_31f2f6cdc217456fc9d0378309"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_9afa1e5a9fd5f40df42fb04fe0"`)
		await queryRunner.query(`DROP TABLE "services"`)
		await queryRunner.query(`DROP TABLE "services_target"`)
		await queryRunner.query(`DROP TABLE "order_service"`)
		await queryRunner.query(`DROP TABLE "orders"`)
		await queryRunner.query(`DROP TABLE "payments"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_99ee315cdaeb17b6b141efdbb3"`)
		await queryRunner.query(`DROP TABLE "order_customer"`)
		await queryRunner.query(`DROP TABLE "order_free_additional_service"`)
		await queryRunner.query(`DROP TABLE "order_additional_service"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_f9baa59bb43bb65fe8b828f5db"`)
		await queryRunner.query(`DROP TABLE "additional_enable_services"`)
		await queryRunner.query(`DROP TABLE "service_categories"`)
		await queryRunner.query(`DROP INDEX "public"."IDX_986e7423fad4e9cf8411938356"`)
		await queryRunner.query(`DROP TABLE "files"`)
		await queryRunner.query(`DROP TABLE "addresses_working_time"`)
	}
}
