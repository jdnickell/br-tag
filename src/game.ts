import { Zombie } from './zombie';
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

// Zombie
const zombie = new Zombie(
    new GLTFShape('models/zombie.glb'),
    new Transform({
        position: new Vector3(16, 0.933, 16)
    })
);

// Configuration
const MOVE_SPEED = 1;
const ROT_SPEED = 1;

// Intermediate variables
const player = Camera.instance;
const transform = zombie.getComponent(Transform);

class ZombieAttack implements ISystem {
    update(dt: number) {
        // Rotate to face the player
        let lookAtTarget = new Vector3(
            player.position.x,
            transform.position.y,
            player.position.z
        );
        let direction = lookAtTarget.subtract(transform.position);
        transform.rotation = Quaternion.Slerp(
            transform.rotation,
            Quaternion.LookRotation(direction),
            dt * ROT_SPEED
        );

        // Continue to move towards the player until it is within 2m away
        let distance = Vector3.DistanceSquared(
            transform.position,
            player.position
        ); // Check distance squared as it's more optimized
        if (distance >= 4) {
            // Note: Distance is squared so a value of 4 is when the zombie is standing 2m away
            zombie.walk();
            let forwardVector = Vector3.Forward().rotate(transform.rotation);
            let increment = forwardVector.scale(dt * MOVE_SPEED);
            transform.translate(increment);
        } else {
            zombie.attack();
        }
    }
}

engine.addSystem(new ZombieAttack());
