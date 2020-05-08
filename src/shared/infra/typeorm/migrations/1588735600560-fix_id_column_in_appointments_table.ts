import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class FixIdColumnInAppointmentsTable1588735600560
  implements MigrationInterface {
  private tableName = 'appointments';

  private columnName = 'id';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ${this.tableName} ALTER COLUMN ${this.columnName} SET DEFAULT uuid_generate_v4()`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ${this.tableName} ALTER COLUMN ${this.columnName} SET DEFAULT NULL`
    );
  }
}
