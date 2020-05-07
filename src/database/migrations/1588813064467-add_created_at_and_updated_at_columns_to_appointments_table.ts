import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddCreatedAtAndUpdatedAtColumnsToAppointmentsTable1588813064467
  implements MigrationInterface {
  private tableName = 'appointments';

  private columns = [
    new TableColumn({
      name: 'created_at',
      type: 'timestamp',
      default: 'now()',
    }),
    new TableColumn({
      name: 'updated_at',
      type: 'timestamp',
      default: 'now()',
    }),
  ];

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumns(this.tableName, this.columns);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumns(this.tableName, this.columns);
  }
}
