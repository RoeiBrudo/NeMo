import setuptools


setuptools.setup(
    name='NeMo',
    version='1.00',

    author='Roei Brudo',
    description='Private Package',

    packages=['NeMo'],
    package_data={'': ['NeMo/**']},
    include_package_data=True,

    install_requires=[
        'numpy',
    ],
)
