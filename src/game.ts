import { PARCEL_WIDTH } from './settings';

export class SimpleMove implements ISystem {
    update() {
        let transform = backWall.getComponent(Transform);
        let distance = Vector3.Forward().scale(0.008);
        transform.translate(distance);
    }
}

function createWall(position: Vector3, scale: Vector3) {
    const wall = new Entity();

    wall.addComponent(new PlaneShape());
    wall.addComponent(
        new Transform({
            position: position,
            scale: scale
        })
    );

    engine.addEntity(wall);

    return wall;
}

const backWall = createWall(
    new Vector3(PARCEL_WIDTH / 2, 0, 0),
    new Vector3(PARCEL_WIDTH, 6, 1)
);

engine.addSystem(new SimpleMove());
