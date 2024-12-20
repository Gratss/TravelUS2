import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddUserProfileFields1703089795115 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("users", [
            new TableColumn({
                name: "avatarUrl",
                type: "varchar",
                isNullable: true
            }),
            new TableColumn({
                name: "bio",
                type: "text",
                isNullable: true
            }),
            new TableColumn({
                name: "socialLinks",
                type: "jsonb",
                isNullable: true
            }),
            new TableColumn({
                name: "privacySettings",
                type: "jsonb",
                isNullable: true
            }),
            new TableColumn({
                name: "preferences",
                type: "jsonb",
                isNullable: true
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "preferences");
        await queryRunner.dropColumn("users", "privacySettings");
        await queryRunner.dropColumn("users", "socialLinks");
        await queryRunner.dropColumn("users", "bio");
        await queryRunner.dropColumn("users", "avatarUrl");
    }
}
