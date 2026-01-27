import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1769382951267 implements MigrationInterface {
  name = 'Initial1769382951267';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "workflows" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "version" integer NOT NULL DEFAULT '1', "is_active" boolean NOT NULL DEFAULT true, "definition" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5b5757cc1cd86268019fef52e0c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."process_instances_status_enum" AS ENUM('ACTIVE', 'COMPLETED', 'CANCELLED', 'PAUSED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "process_instances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "workflow_id" uuid NOT NULL, "current_node_id" character varying NOT NULL, "status" "public"."process_instances_status_enum" NOT NULL DEFAULT 'ACTIVE', "context" jsonb NOT NULL DEFAULT '{}', "created_by" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_58493abf24b5dfc4822edd7531f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."data_sources_source_type_enum" AS ENUM('SQL', 'API')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."data_sources_status_enum" AS ENUM('PENDING', 'SUCCESS', 'ERROR')`,
    );
    await queryRunner.query(
      `CREATE TABLE "data_sources" ("id" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying, "source_type" "public"."data_sources_source_type_enum" NOT NULL DEFAULT 'SQL', "query_sql" text, "api_url" text, "api_method" character varying, "api_headers" jsonb NOT NULL DEFAULT '{}', "mapping_config" jsonb, "status" "public"."data_sources_status_enum" NOT NULL DEFAULT 'PENDING', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dc70b1c6b641726739857fd938d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "process_instances" ADD CONSTRAINT "FK_4505cddc1b1c333239de51e34f8" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "process_instances" DROP CONSTRAINT "FK_4505cddc1b1c333239de51e34f8"`,
    );
    await queryRunner.query(`DROP TABLE "data_sources"`);
    await queryRunner.query(`DROP TYPE "public"."data_sources_status_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."data_sources_source_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "process_instances"`);
    await queryRunner.query(
      `DROP TYPE "public"."process_instances_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "workflows"`);
  }
}
