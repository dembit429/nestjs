import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductsTable1755094596185 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "product" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "brand" character varying(50) NOT NULL,
                "model" character varying(50) NOT NULL,
                "price" integer NOT NULL,
                "created_at" date NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "categoryId" UUID NOT NULL,
                CONSTRAINT "PK_1234567890abcdef1234567890abcdef" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            ALTER TABLE "product"
            ADD CONSTRAINT "FK_1234567890abcdef1234567890abcdef" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "product"
            DROP CONSTRAINT "FK_1234567890abcdef1234567890abcdef"
        `);

    await queryRunner.query(`
            DROP TABLE "product"
        `);
  }
}
