# General notes on surface geometry

## Sphere surface

```Javascript
const spinSpeed = 0.01; // Speed of the spin
sphere.theta = Time * spinSpeed * sphere.seed2 + sphere.seed;
sphere.phi = Time * spinSpeed  * sphere.seed4 + sphere.seed3;
```

I think the way to avoid all spheres passing through the poles here would be to limit  the sinusoids to swing from 0 and 2PI. What we achieved with this is simply spheres moving at different velocities, but essentially tracing rings on a sphere.

A way to avoid this would be indeed to limit the full swing of the sines and cosines from going all the way to the poles. However, this would result in no sphere traveling through the poles at all.

As a result, we might limit the amplitude span of the sinusoids and then randomly move the spheres so that their journeys cover "patches" of the overall spheres and, in aggregate, they seem to be moving more randomly.

### Rings accelerating and slowing down

As we inferred, we were investigating the right track. Using this code:

```JavaScript
sphere.theta = (Time ) * spinSpeed + 0.5 * Math.sin(Time * spinSpeed * 2 + Math.PI * 5 / 12 ) ;
sphere.phi = Time * spinSpeed  * sphere.seed4 + sphere.seed3;
```

We managed to have a ring of spheres accelerating in the middle and slowing down at the poles.

## Odd shapes

I don't yet know how I achieved this, I need to think about it.
I wanted to make the spheres "swing" around the surface sphere, similar to what a pendulum might do when in two dimensions with gravity — speeding up at the bottom, slowing down at the top.
My first attempt was to think in terms of constant angular acceleration (which I kept named as `spinSpeed` out of laziness), but if I think about it this approach is not right. Then I messed with it and this now does not make any physical sense.
Still, I kept it since it prouduces a cool effect.

```Javascript
// Dope effect I don't know how I caused it
sphere.theta = Time * (spinSpeed * Math.cos(Time / 50) ) * 30 + sphere.seed^2 / 20;
sphere.phi = Time * (spinSpeed * Math.cos(Time / 50) ) * 30 + sphere.seed3^2 / 80;
```

In reality, to achieve what I had in mind I think the angular acceleration — i.e. the force — itself should be a sinusoidal function of time, and the angular speed would be the integral of this — i.e., another sinusoid, shifted so that it oscillates between maxSpeed and 0.

Cool effects can also be obtained by not only changing $\phi$ and $\theta$, but also — it seems — adding a random number to each sphere when converting to Cartesian coordinates like so:

```Javascript
x0 = Math.cos(sphere.phi + sphere.seed3) * Math.sin(sphere.theta) * sphere.radius;
z0 = Math.sin(sphere.phi) * Math.sin(sphere.theta) * sphere.radius;
y0 = Math.cos(sphere.theta) * sphere.radius + y_off; // Preserve the original y position
```
