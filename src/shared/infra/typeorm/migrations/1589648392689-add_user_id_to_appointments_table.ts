import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddUserIdToAppointmentsTable1589648392689
  implements MigrationInterface {
  private tableName = 'appointments';

  private column = new TableColumn({
    name: 'user_id',
    type: 'varchar',
    isNullable: true,
  });

  private foreignKey = new TableForeignKey({
    name: 'AppointmentUser',
    columnNames: ['user_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'users',
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(this.tableName, this.column);

    await queryRunner.createForeignKey(this.tableName, this.foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(this.tableName, this.foreignKey);

    await queryRunner.dropColumn(this.tableName, this.column);
  }
}
