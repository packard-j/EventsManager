import {MigrationInterface, QueryRunner} from "typeorm";

export class AssignmentRefactoring1538739717856 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_assignment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "zone" integer NOT NULL, "dateCreated" datetime NOT NULL DEFAULT (datetime('now')), "dateUpdated" datetime NOT NULL DEFAULT (datetime('now')), "locationId" integer, CONSTRAINT "FK_7eeb4112faa5d871f57bccfda3a" FOREIGN KEY ("locationId") REFERENCES "location" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_assignment"("id", "zone", "dateCreated", "dateUpdated", "locationId") SELECT "id", "zone", "dateCreated", "dateUpdated", "locationId" FROM "assignment"`);
        await queryRunner.query(`DROP TABLE "assignment"`);
        await queryRunner.query(`ALTER TABLE "temporary_assignment" RENAME TO "assignment"`);
        await queryRunner.query(`CREATE TABLE "temporary_assignment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "zone" integer NOT NULL, "dateCreated" datetime NOT NULL DEFAULT (datetime('now')), "dateUpdated" datetime NOT NULL DEFAULT (datetime('now')), "locationId" integer, "startHour" integer NOT NULL, "startMinute" integer NOT NULL, "endHour" integer NOT NULL, "endMinute" integer NOT NULL, CONSTRAINT "FK_7eeb4112faa5d871f57bccfda3a" FOREIGN KEY ("locationId") REFERENCES "location" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_assignment"("id", "zone", "dateCreated", "dateUpdated", "locationId") SELECT "id", "zone", "dateCreated", "dateUpdated", "locationId" FROM "assignment"`);
        await queryRunner.query(`DROP TABLE "assignment"`);
        await queryRunner.query(`ALTER TABLE "temporary_assignment" RENAME TO "assignment"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "assignment" RENAME TO "temporary_assignment"`);
        await queryRunner.query(`CREATE TABLE "assignment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "zone" integer NOT NULL, "dateCreated" datetime NOT NULL DEFAULT (datetime('now')), "dateUpdated" datetime NOT NULL DEFAULT (datetime('now')), "locationId" integer, CONSTRAINT "FK_7eeb4112faa5d871f57bccfda3a" FOREIGN KEY ("locationId") REFERENCES "location" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "assignment"("id", "zone", "dateCreated", "dateUpdated", "locationId") SELECT "id", "zone", "dateCreated", "dateUpdated", "locationId" FROM "temporary_assignment"`);
        await queryRunner.query(`DROP TABLE "temporary_assignment"`);
        await queryRunner.query(`ALTER TABLE "assignment" RENAME TO "temporary_assignment"`);
        await queryRunner.query(`CREATE TABLE "assignment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "zone" integer NOT NULL, "startTime" varchar NOT NULL, "endTime" varchar NOT NULL, "dateCreated" datetime NOT NULL DEFAULT (datetime('now')), "dateUpdated" datetime NOT NULL DEFAULT (datetime('now')), "locationId" integer, CONSTRAINT "FK_7eeb4112faa5d871f57bccfda3a" FOREIGN KEY ("locationId") REFERENCES "location" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "assignment"("id", "zone", "dateCreated", "dateUpdated", "locationId") SELECT "id", "zone", "dateCreated", "dateUpdated", "locationId" FROM "temporary_assignment"`);
        await queryRunner.query(`DROP TABLE "temporary_assignment"`);
    }

}
